// ==UserScript==
// @name         YouTube Playlist Overview Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Opens playlist overview page instead of starting the first video, and skips the video page when navigating back from the playlist on YouTube by jumping two steps back in history.
// @author       Md. Rokibul Hassan Roki
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let lastPlaylistPage = null;

    function modifyPlaylistLinks() {
        const links = document.querySelectorAll('a[href*="list="]');
        links.forEach(link => {
            if (!link.dataset.modified) {
                link.dataset.modified = 'true';
                link.addEventListener('click', handlePlaylistClick, true);
            }
        });
    }

    function handlePlaylistClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const url = new URL(event.currentTarget.href);
        const playlistId = url.searchParams.get('list');
        if (playlistId) {
            lastPlaylistPage = window.location.href;
            window.location.href = `${window.location.origin}/playlist?list=${playlistId}`;
        }
    }

    function handleBackNavigation(event) {
        if (document.location.pathname === '/watch' && document.location.search.includes('list=')) {
            if (lastPlaylistPage) {
                if (event.cancelable) {
                    event.preventDefault();
                }
                window.location.href = lastPlaylistPage;
                lastPlaylistPage = null;
            }
        }
    }

    const observer = new MutationObserver(modifyPlaylistLinks);

    observer.observe(document.body, { childList: true, subtree: true });

    modifyPlaylistLinks();

    let navigationTimeout = null;

    function applyAfterTimeout() {
        clearTimeout(navigationTimeout);
        navigationTimeout = setTimeout(modifyPlaylistLinks, 1000);
    }

    window.addEventListener('yt-navigate-finish', modifyPlaylistLinks);
    window.addEventListener('yt-navigate-finish', applyAfterTimeout);

    window.addEventListener('popstate', handleBackNavigation);
})();
