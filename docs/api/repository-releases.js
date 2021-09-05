
export default async function getRepositoryReleases(owner, repository_name) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repository_name}/releases`);
  const releases = await response.json();

  return releases;
}

export async function getRepositoryLatestRelease(owner, repository_name) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repository_name}/releases?per_page=1`);
  const [release] = await response.json();

  return release;
}

export async function downloadRepositoryLatestRelease(owner, repository_name) {
  const release = await getRepositoryLatestRelease(owner, repository_name);
  const assets_response = await fetch(release.assets_url);
  const assets = await assets_response.json();

  // we don't want to download all the files when there are multiple assets.
  // Some releases contain multiple variants for a single file, for example
  // a version for Windows and a version for Linux.
  //
  // In that case we open the release page in a new tab
  if (assets.length > 1) {
    window.open(release.html_url, '_blank');

    return;
  }

  for (const asset of assets) {
    window.open(asset.browser_download_url, '_blank');
  }

}