export interface SyntaxCheckResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedUrl: string;
  scheme: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  isIpv4: boolean;
  isIpv6: boolean;
  hasPunycode: boolean;
  hasUnescapedChars: boolean;
}

const RFC_IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function validateUrlSyntax(rawInput: string): SyntaxCheckResult {
  const trimmed = (rawInput || '').trim();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!trimmed) {
    return {
      isValid: false,
      errors: ['Input string is empty.'],
      warnings: [],
      normalizedUrl: '',
      scheme: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      isIpv4: false,
      isIpv6: false,
      hasPunycode: false,
      hasUnescapedChars: false,
    };
  }

  // Check unescaped spaces or control characters
  const hasSpaces = /\s/.test(trimmed);
  if (hasSpaces) {
    errors.push('URL contains unencoded whitespace characters (RFC 3986 violation).');
  }

  // Scheme validation
  let hasValidSchemePrefix = false;
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//.test(trimmed)) {
    hasValidSchemePrefix = true;
  }

  let parseTarget = trimmed;
  if (!hasValidSchemePrefix) {
    // Check if it's missing scheme
    warnings.push('Scheme missing (e.g. "https://"). Auto-prefixed "https://" for standard RFC parsing.');
    parseTarget = `https://${trimmed}`;
  }

  let parsed: URL | null = null;
  try {
    parsed = new URL(parseTarget);
  } catch (err: any) {
    errors.push(`URL parsing failed: ${err.message || 'Malformed RFC syntax'}`);
    return {
      isValid: false,
      errors,
      warnings,
      normalizedUrl: trimmed,
      scheme: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      isIpv4: false,
      isIpv6: false,
      hasPunycode: false,
      hasUnescapedChars: hasSpaces,
    };
  }

  const scheme = parsed.protocol.replace(':', '').toLowerCase();
  if (scheme !== 'http' && scheme !== 'https') {
    if (['ftp', 'file', 'javascript', 'data'].includes(scheme)) {
      warnings.push(`Non-standard web protocol detected: "${scheme}". Web security gateways typically monitor HTTP/HTTPS.`);
    } else {
      errors.push(`Invalid or disallowed URL scheme: "${scheme}". Only http/https are supported for live phishing analysis.`);
    }
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!hostname) {
    errors.push('URL has no valid hostname or authority segment.');
  }

  const cleanHost = hostname.split(':')[0].replace(/^\[|\]$/g, '');
  const isIpv4 = RFC_IP_REGEX.test(cleanHost);
  const isIpv6 = hostname.includes(':') && (parsed.host.startsWith('[') || cleanHost.includes(':'));

  if (isIpv4) {
    warnings.push('Authority uses a direct raw IPv4 address rather than a registered domain name.');
  }
  if (isIpv6) {
    warnings.push('Authority uses a direct raw IPv6 literal address.');
  }

  const hasPunycode = hostname.includes('xn--');
  if (hasPunycode) {
    warnings.push('Internationalized Domain Name (IDN) punycode detected ("xn--"). Potential homograph spoof.');
  }

  // Check TLD presence if not IP
  if (!isIpv4 && !isIpv6 && hostname) {
    const parts = hostname.split('.');
    if (parts.length < 2) {
      errors.push('Hostname lacks a valid Top-Level Domain (TLD) extension (e.g., .com, .org, .xyz).');
    } else {
      const tld = parts[parts.length - 1];
      if (/^\d+$/.test(tld)) {
        errors.push(`Invalid numeric TLD: ".${tld}". Hostnames cannot terminate in pure integers.`);
      }
    }
  }

  // Check RFC port validity
  if (parsed.port) {
    const portNum = parseInt(parsed.port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      errors.push(`Port "${parsed.port}" is out of allowable RFC port range (1-65535).`);
    }
  }

  // Check consecutive slashes in path
  if (parsed.pathname.includes('//')) {
    warnings.push('Path contains consecutive slashes ("//") which can be used for directory traversal or redirect obfuscation.');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    normalizedUrl: parsed.href,
    scheme: parsed.protocol,
    hostname: parsed.hostname,
    port: parsed.port || (scheme === 'https' ? '443' : '80'),
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    isIpv4,
    isIpv6,
    hasPunycode,
    hasUnescapedChars: hasSpaces,
  };
}
