//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/common/functions.js
function getHash() {
	if (location.hash) return location.hash.replace("#", "");
}
var bodyLockStatus = true;
var bodyLockToggle = (delay = 500) => {
	if (document.documentElement.hasAttribute("data-fls-scrolllock")) bodyUnlock(delay);
	else bodyLock(delay);
};
var bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		setTimeout(() => {
			lockPaddingElements.forEach((lockPaddingElement) => {
				lockPaddingElement.style.paddingRight = "";
			});
			document.body.style.paddingRight = "";
			document.documentElement.removeAttribute("data-fls-scrolllock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
var bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
		lockPaddingElements.forEach((lockPaddingElement) => {
			lockPaddingElement.style.paddingRight = lockPaddingValue;
		});
		document.body.style.paddingRight = lockPaddingValue;
		document.documentElement.setAttribute("data-fls-scrolllock", "");
		bodyLockStatus = false;
		setTimeout(function() {
			bodyLockStatus = true;
		}, delay);
	}
};
function uniqArray(array) {
	return array.filter((item, index, self) => self.indexOf(item) === index);
}
var gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
	const targetBlockElement = document.querySelector(targetBlock);
	if (targetBlockElement) {
		let headerItem = "";
		let headerItemHeight = 0;
		if (noHeader) {
			headerItem = "header.header";
			const headerElement = document.querySelector(headerItem);
			if (!headerElement.classList.contains("--header-scroll")) {
				headerElement.style.cssText = `transition-duration: 0s;`;
				headerElement.classList.add("--header-scroll");
				headerItemHeight = headerElement.offsetHeight;
				headerElement.classList.remove("--header-scroll");
				setTimeout(() => {
					headerElement.style.cssText = ``;
				}, 0);
			} else headerItemHeight = headerElement.offsetHeight;
		}
		if (document.documentElement.hasAttribute("data-fls-menu-open")) {
			bodyUnlock();
			document.documentElement.removeAttribute("data-fls-menu-open");
		}
		let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
		targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
		targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
		window.scrollTo({
			top: targetBlockElementPosition,
			behavior: "smooth"
		});
	}
};
//#endregion
//#region src/components/layout/menu/menu.js
function menuInit() {
	document.addEventListener("click", function(e) {
		if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
			bodyLockToggle();
			document.documentElement.toggleAttribute("data-fls-menu-open");
		}
	});
}
document.querySelector("[data-fls-menu]") && window.addEventListener("load", menuInit);
//#endregion
//#region src/components/effects/preloader/preloader.js
function preloader() {
	const preloaderImages = document.querySelectorAll("img");
	const htmlDocument = document.documentElement;
	const isPreloaded = localStorage.getItem(location.href) && document.querySelector("[data-fls-preloader=\"true\"]");
	if (preloaderImages.length && !isPreloaded) {
		document.body.insertAdjacentHTML("beforeend", `
			<div class="fls-preloader">
				<div class="fls-preloader__q">Q</div>
			</div>`);
		document.querySelector(".fls-preloader");
		let imagesLoadedCount = 0;
		htmlDocument.setAttribute("data-fls-preloader-loading", "");
		htmlDocument.setAttribute("data-fls-scrolllock", "");
		preloaderImages.forEach((preloaderImage) => {
			const imgClone = document.createElement("img");
			if (imgClone) {
				imgClone.onload = imageLoaded;
				imgClone.onerror = imageLoaded;
				preloaderImage.dataset.src ? imgClone.src = preloaderImage.dataset.src : imgClone.src = preloaderImage.src;
			}
		});
		function imageLoaded() {
			imagesLoadedCount++;
			if (imagesLoadedCount >= preloaderImages.length) setTimeout(addLoadedClass, 300);
		}
		const preloaderOnce = () => localStorage.setItem(location.href, "preloaded");
		document.querySelector("[data-fls-preloader=\"true\"]") && preloaderOnce();
	} else addLoadedClass();
	function addLoadedClass() {
		htmlDocument.setAttribute("data-fls-preloader-loaded", "");
		htmlDocument.removeAttribute("data-fls-preloader-loading");
		htmlDocument.removeAttribute("data-fls-scrolllock");
	}
}
document.addEventListener("DOMContentLoaded", preloader);
//#endregion
export { uniqArray as i, getHash as n, gotoBlock as r, bodyUnlock as t };
