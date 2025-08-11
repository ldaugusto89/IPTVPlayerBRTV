
export function buildXtreamUrls(host: string, username: string, password: string) {
  const base = host.endsWith('/') ? host.slice(0, -1) : host;
  return {
    m3u: `${base}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts`,
    epg: `${base}/xmltv.php?username=${username}&password=${password}`,
    api: `${base}/player_api.php?username=${username}&password=${password}`,
  };
}