type OpenDataDownloadMenuProps = {
    urls: string[];
};

type DownloadLink = {
    url: string;
    protocol: string;
    host?: string;
};

const parseDownloadLink = (url: string): DownloadLink => {
    try {
        const parsed = new URL(url);

        return {
            url,
            protocol: parsed.protocol.replace(/:$/, '').toUpperCase(),
            host: parsed.host || undefined,
        };
    } catch {
        const separatorIndex = url.indexOf('://');

        return {
            url,
            protocol: separatorIndex > 0 ? url.slice(0, separatorIndex).toUpperCase() : 'DOWNLOAD',
        };
    }
};

export const OpenDataDownloadMenu = ({ urls }: OpenDataDownloadMenuProps) => {
    if (urls.length === 0) {
        return <span className="text-sm text-neutral-500 dark:text-neutral-400">Unavailable</span>;
    }

    const links = urls.map(parseDownloadLink);

    const hosts = new Set(links.map(link => link.host).filter((host): host is string => Boolean(host)));

    const showHosts = hosts.size > 1;

    return (
        <details className="relative inline-block">
            <summary className="cursor-pointer list-none rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 [&::-webkit-details-marker]:hidden">
                Download <span aria-hidden="true">▾</span>
            </summary>

            <div className="absolute right-0 z-20 mt-1 min-w-48 overflow-hidden rounded-md border border-neutral-200 bg-neutral-0 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                {links.map((link, index) => {
                    const openInNewTab = link.protocol === 'HTTP' || link.protocol === 'HTTPS';

                    return (
                        <a
                            key={`${link.url}-${index}`}
                            href={link.url}
                            target={openInNewTab ? '_blank' : undefined}
                            rel={openInNewTab ? 'noopener noreferrer' : undefined}
                            className="block whitespace-nowrap px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            Download via {link.protocol}
                            {showHosts && link.host ? ` — ${link.host}` : ''}
                        </a>
                    );
                })}
            </div>
        </details>
    );
};
