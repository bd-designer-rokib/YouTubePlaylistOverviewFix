// ==UserScript==
// @name         YouTube Playlist Overview Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Opens playlist overview page instead of starting the first video on YouTube playlist click.
// @author       Md. Rokibul Hassan Roki
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function modifyPlaylistLinks() {
        let links = document.querySelectorAll('a');

        links.forEach(link => {
            if (link.href && link.href.includes('list=')) {
                if (!link.dataset.modified) {
                    link.dataset.modified = 'true';

                    link.addEventListener('click', function (event) {
                        event.preventDefault();

                        let url = new URL(link.href);
                        let playlistId = url.searchParams.get('list');

                        if (playlistId) {
                            window.location.href = `/playlist?list=${playlistId}`;
                        }
                    });
                }
            }
        });
    }

    const observer = new MutationObserver(modifyPlaylistLinks);

    observer.observe(document.body, { childList: true, subtree: true });

    modifyPlaylistLinks();

    window.addEventListener('yt-navigate-finish', modifyPlaylistLinks);
})();
