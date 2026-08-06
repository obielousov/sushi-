import "./preloader.js";
import { a as gotoBlock, i as getHash, r as bodyUnlock } from "./common.js";
/* empty css      */
/* empty css      */
import "./watcher.js";
//#region src/components/pages/menupage/menupage.js
var bodyMenu = document.querySelector(".menu-page__body");
var headerNav = document.querySelector(".body-menu__header");
var isTablet = () => window.matchMedia("(max-width: 992px)").matches;
var getScrollOffset = () => {
	if (!isTablet()) return 100;
	return (headerNav?.offsetHeight || 0) + 20;
};
document.querySelectorAll(".body-menu__button[data-fls-scrollto]").forEach((btn) => {
	btn.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const target = document.querySelector(btn.dataset.flsScrollto);
		if (!target) return;
		const offsetValue = getScrollOffset();
		if (isTablet()) {
			const offset = target.getBoundingClientRect().top + window.scrollY - offsetValue;
			window.scrollTo({
				top: offset,
				behavior: "smooth"
			});
		} else if (bodyMenu) {
			const offset = target.offsetTop - offsetValue;
			bodyMenu.scrollTo({
				top: offset,
				behavior: "smooth"
			});
		}
	});
});
if (headerNav) {
	const onScroll = () => {
		const scrollTop = isTablet() ? window.scrollY : bodyMenu?.scrollTop || 0;
		headerNav.classList.toggle("--scrolled", scrollTop > 10);
	};
	bodyMenu?.addEventListener("scroll", onScroll);
	window.addEventListener("scroll", onScroll);
}
//#endregion
//#region src/components/effects/scrollto/scrollto.js
function pageNavigation() {
	document.addEventListener("click", pageNavigationAction);
	document.addEventListener("watcherCallback", pageNavigationAction);
	function pageNavigationAction(e) {
		if (e.type === "click") {
			const targetElement = e.target;
			if (targetElement.closest("[data-fls-scrollto]")) {
				const gotoLink = targetElement.closest("[data-fls-scrollto]");
				const gotoLinkSelector = gotoLink.dataset.flsScrollto ? gotoLink.dataset.flsScrollto : "";
				const noHeader = gotoLink.hasAttribute("data-fls-scrollto-header") ? true : false;
				const gotoSpeed = gotoLink.dataset.flsScrolltoSpeed ? gotoLink.dataset.flsScrolltoSpeed : 500;
				const offsetTop = gotoLink.dataset.flsScrolltoTop ? parseInt(gotoLink.dataset.flsScrolltoTop) : 0;
				if (window.fullpage) {
					const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fls-fullpage-section]");
					const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.flsFullpageId : null;
					if (fullpageSectionId !== null) {
						window.fullpage.switchingSection(fullpageSectionId);
						if (document.documentElement.hasAttribute("data-fls-menu-open")) {
							bodyUnlock();
							document.documentElement.removeAttribute("data-fls-menu-open");
						}
					}
				} else gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
				e.preventDefault();
			}
		} else if (e.type === "watcherCallback" && e.detail) {
			const entry = e.detail.entry;
			const targetElement = entry.target;
			if (targetElement.dataset.flsWatcher === "navigator") {
				document.querySelector(`[data-fls-scrollto].--navigator-active`);
				let navigatorCurrentItem;
				if (targetElement.id && document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-fls-scrollto="#${targetElement.id}"]`);
				else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
					const element = targetElement.classList[index];
					if (document.querySelector(`[data-fls-scrollto=".${element}"]`)) {
						navigatorCurrentItem = document.querySelector(`[data-fls-scrollto=".${element}"]`);
						break;
					}
				}
				if (entry.isIntersecting) navigatorCurrentItem && navigatorCurrentItem.classList.add("--navigator-active");
				else navigatorCurrentItem && navigatorCurrentItem.classList.remove("--navigator-active");
			}
		}
	}
	if (getHash()) {
		let goToHash;
		if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`;
		else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
		goToHash && gotoBlock(goToHash);
	}
}
document.querySelector("[data-fls-scrollto]") && window.addEventListener("load", pageNavigation);
//#endregion
