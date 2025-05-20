(function () {
  const essentialsMeta = window.essentialAnnouncementMeta;
  function getConfig() {
    const configs = window.essentialAnnouncementConfigs;
    return new Promise((resolve) => {
      resolve(configs);
    });
  }

  // pages
  let homePageRoot = window.Shopify?.routes?.root || "/";
  if (homePageRoot.length > 1) {
    homePageRoot = homePageRoot.slice(0, homePageRoot.length - 1);
  }

  const isHomePage = window.location.pathname === homePageRoot;

  const isProductPage =
    window.location && window.location.pathname.includes("/products/");
  const isCollectionPage =
    window.location &&
    window.location.pathname.includes("/collections/") &&
    !isProductPage;
  const isCartPage =
    window.location && window.location.pathname.includes("/cart");

  // utility function that simplifies creation of new html node
  function create({
    tag,
    appendTo,
    children = [],
    attributes = {},
    events = {},
  }) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      element[key] = value;
    });

    Object.entries(events).forEach(([key, value]) => {
      element.addEventListener(key, value);
    });

    if (appendTo) {
      appendTo.appendChild(element);
    }

    children.forEach((child) => child && element.appendChild(child));

    return element;
  }

  // utility function that simplifies editing of new html node
  function update(
    createdElement,
    { appendTo, children = [], attributes = {}, events = {} }
  ) {
    const element = createdElement;

    Object.entries(attributes).forEach(([key, value]) => {
      element[key] += value;
    });

    Object.entries(events).forEach(([key, value]) => {
      element.addEventListener(key, value);
    });

    if (appendTo) {
      appendTo.appendChild(element);
    }

    children.forEach((child) => child && element.appendChild(child));

    return element;
  }

  function createSvgIgon(icon, color, width = 12, height = 12) {
    const IconSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const IconSVGPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    IconSVG.setAttribute("width", width);
    IconSVG.setAttribute("height", height);
    IconSVG.setAttribute("fill", "none");

    IconSVGPath.setAttribute("d", icon);

    IconSVGPath.setAttribute("fill", color);
    IconSVG.append(IconSVGPath);
    return IconSVG;
  }

  function closeButtonIconSVG(color) {
    const closeIcon =
      "m7.414 6 4.293-4.293A.999.999 0 1 0 10.293.293L6 4.586 1.707.293A.999.999 0 1 0 .293 1.707L4.586 6 .293 10.293a.999.999 0 1 0 1.414 1.414L6 7.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L7.414 6Z";
    return createSvgIgon(closeIcon, color);
  }

  function nextButtonIconSVG(color) {
    const nextIcon =
      "M8.00001 16C7.74401 16 7.48801 15.902 7.29301 15.707C6.90201 15.316 6.90201 14.684 7.29301 14.293L11.586 10L7.29301 5.70701C6.90201 5.31601 6.90201 4.68401 7.29301 4.29301C7.68401 3.90201 8.31601 3.90201 8.70701 4.29301L13.707 9.29301C14.098 9.68401 14.098 10.316 13.707 10.707L8.70701 15.707C8.51201 15.902 8.25601 16 8.00001 16Z";
    return createSvgIgon(nextIcon, color, 20, 20);
  }

  function prevButtonIconSVG(color) {
    const prevIcon =
      "M12 16C11.744 16 11.488 15.902 11.293 15.707L6.29301 10.707C5.90201 10.316 5.90201 9.68401 6.29301 9.29301L11.293 4.29301C11.684 3.90201 12.316 3.90201 12.707 4.29301C13.098 4.68401 13.098 5.31601 12.707 5.70701L8.41401 10L12.707 14.293C13.098 14.684 13.098 15.316 12.707 15.707C12.512 15.902 12.256 16 12 16Z";
    return createSvgIgon(prevIcon, color, 20, 20);
  }

  function appdedCss(css) {
    const head = document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("id", "essential-apps-announcement-bar-css");
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  function fontFamily(styleConfig) {
    return styleConfig.font !== "" && styleConfig.font
      ? `font-family: ${styleConfig.font};\n`
      : "";
  }

  function sideCartNode() {
    let bannersNode;
    const root = window.Shopify?.routes?.root || "/";
    const cartForm = document.querySelector(`form[action="${root}cart"]`);
    // cart notification - popup notification
    const knownSideCarts = document.querySelectorAll(
      "cart-notification .cart-notification__links"
    );

    // Debutify theme: {"top: '.drawer.ajaxcart--is-loading .flex'"}
    // Prestige new: cart-drawer .cart-drawer__items
    const sideCartNodes = document.querySelectorAll(
      ".side-cart, .drawer.ajaxcart--is-loading .flex, .cart-drawer .cart-drawer__items"
    );

    const noCartFormFound = document.querySelectorAll(".cart-drawer");

    const sideCartTopSnippet = document.querySelector(
      ".essential-announcement-bar-side-cart"
    );

    if (sideCartTopSnippet) {
      return sideCartTopSnippet;
    }
    if (knownSideCarts.length > 0) {
      bannersNode = knownSideCarts[knownSideCarts.length - 1];
    } else if (sideCartNodes.length > 0) {
      bannersNode = sideCartNodes[sideCartNodes.length - 1];
    } else if (cartForm) {
      bannersNode = cartForm;
    } else if (noCartFormFound) {
      bannersNode = noCartFormFound[noCartFormFound.length - 1];
    }

    return bannersNode;
  }

  const ctaHref = (ctaLink, createdAt) => {
    if (new Date(createdAt).getTime() < 1732608220000) {
      return ctaLink;
    }
    if (ctaLink.includes("http://") || ctaLink.includes("https://")) {
      return ctaLink;
    } else if (ctaLink.startsWith("/")) {
      return ctaLink.replace("/", Shopify?.routes?.root || "/");
    }

    return ctaLink;
  };

  function appendAnnoucementBarCss(config, animationDuration) {
    const styleConfig = config.style;

    const smallerOnMobile = (config, styleConfig) => {
      if (
        !config.createdAt ||
        new Date(config.createdAt).getTime() < 1701866300000
      ) {
        return "";
      }

      return `
        @media (max-width: 620px) { 
          .essential_annoucement_bar_running_line_title_${config.id} {
            font-size: ${Math.floor(styleConfig.titleSize * 0.8)}px;
          }

          .essential_annoucement_bar_wrapper_${config.id} h2, 
          .essential_annoucement_bar_wrapper_${config.id} h4,
          .essential_annoucement_bar_title_container_${config.id},
          #essential_annoucement_bar_title_${config.id} {
              font-size: ${Math.floor(styleConfig.titleSize * 0.8)}px;
          }

          .essential_annoucement_bar_subheading_${config.id} {
            font-size: ${Math.floor(styleConfig.subheadingSize * 0.8)}px;
          }

          .essential_annoucement_bar_cta_${config.id} {
            font-size: ${Math.floor(styleConfig.buttonFontSize * 0.9)}px;
          }
        }`;
    };

    const customCssStore = () => {
      if (Shopify.shop === "cb01ee-2.myshopify.com") {
        return `@media only screen and (max-width: 767px) {
                  body > .essential_annoucement_bar_wrapper {
                    display:none!important;
                  }
                }`;
      }

      return "";
    };

    const wrapperBackground =
      styleConfig.backgroundType === "gradientBackground"
        ? `linear-gradient(${styleConfig.gradientTurn}deg, ${styleConfig.gradientStart}, ${styleConfig.gradientEnd})`
        : styleConfig.singleColor;

    const css = `
        .essential_annoucement_bar_wrapper_${config.id} {
          overflow: hidden;
          position: relative;
          display: flex !important;
          flex-wrap: nowrap;
          column-gap: 26px;
          row-gap: 10px;
          ${fontFamily(styleConfig)}
          background: ${wrapperBackground};
          padding: 10px;
          ${
            config.type === "cart-page"
              ? `
            padding-top: ${styleConfig.spacing.insideTop}px;
            padding-bottom: ${styleConfig.spacing.insideBottom}px;
            margin-top: ${styleConfig.spacing.outsideTop}px;
            margin-bottom: ${styleConfig.spacing.outsideBottom}px;
          `
              : ""
          }
          align-items: center;
          justify-content: center;
          width: 100%;
           border-radius: ${styleConfig.borderRadius}px;
          border: ${styleConfig.borderColor} solid ${styleConfig.borderSize}px;
          ${
            styleConfig.announcementBarStyle === "seperate-centered"
              ? `flex-flow: column;
              justify-items: center;`
              : ""
          }
        }

        .essential_annoucement_bar_wrapper_${config.id}.top_page {
          z-index: 101;
        }

        .essential_annoucement_bar_wrapper_${config.id}.top_page_styles {}

        .essential_annoucement_bar_wrapper_${config.id}.top_page_sticky {
          position: sticky; 
          top: 0;
        }

        .essential_annoucement_bar_wrapper_${config.id}.bottom_page {
          z-index: 101;
          bottom: 0; 
          left: 0;
          position: fixed;
          width: 100%;
        }

        .essential_annoucement_bar_wrapper_${config.id}.bottom_page_styles {}
        
        .essential_annoucement_bar_wrapper_${config.id}.clickable {
          cursor: pointer;
        }

        .essential_annoucement_main_content_wrapper_${config.id} {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          overflow: hidden;
          gap: ${config.announcementType !== "rotating" ? "26px" : "0"};
        }

        .essential_annoucement_titles_outside_wrapper_${config.id} {
          overflow: hidden;
          position: relative;
          width: ${config.announcementType === "simple" ? "auto" : "100%"};
          padding: ${config.announcementType === "rotating" ? "0 20px" : "0"};
        }

        .essential_annoucement_running_line_wrapper_${config.id} {
          display: flex;
          width: 100%;
        }

        .essential_annoucement_bar_running_line_title_${config.id} {
          ${fontFamily(styleConfig)}font-weight: bold;
          font-size: ${styleConfig.titleSize}px;
          color: ${styleConfig.titleColor};
          margin: 0;
          padding: 0;
          line-height: 1.2;
          letter-spacing: normal;
          text-transform: none;
          text-align: left;
          white-space: nowrap;
          animation: runningLine ${animationDuration}s linear infinite;
          animation-delay: -${animationDuration}s;
          display: flex;
          gap: 26px;
          padding-right: 26px;
        }

        .essential_annoucement_running_line_wrapper_${
          config.id
        } .essential_annoucement_bar_running_line_title_${
      config.id
    }:nth-child(2) {
          animation: runningLine2 ${animationDuration}s linear infinite;
          animation-delay: -${animationDuration / 2}s;
        }

        .essential_annoucement_bar_slider_container_${config.id} {
          margin: 0;
          align-items: center;
        }

        .essential_annoucement_bar_slide_${config.id} {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 26px;
        }

        .essential_annoucement_bar_slide_${config.id}.glide__slide--active {
          z-index: 1;
        }

        .essential_annoucement_bar_slide_${config.id}.clickable {
          cursor: pointer;
        }

        .essential_annoucement_bar_glide__arrow {
          cursor: pointer;
        }

        .essential_annoucement_bar_glide__arrows_prev_${config.id} {
          position: absolute;
          left: -20px;
          top: 0;
          bottom: 0;
          height: 20px;
          margin: auto;
        }

        .essential_annoucement_bar_glide__arrows_next_${config.id} {
          position: absolute;
          right: -20px;
          top: 0;
          bottom: 0;
          height: 20px;
          margin: auto;
        }

        .essential_annoucement_titles_wrapper_${config.id}.center {
          text-align: center;
        }
        
        .essential_annoucement_bar_wrapper_${config.id} h2, 
        .essential_annoucement_bar_wrapper_${config.id} h4, 
        .essential_annoucement_bar_title_container_${config.id}, 
        #essential_annoucement_bar_title_${config.id} {
            ${fontFamily(styleConfig)}font-weight: bold;
            font-size: ${styleConfig.titleSize}px;
            color: ${styleConfig.titleColor};
            margin: 0;
            padding: 0;
            line-height: 1.2;
            letter-spacing: normal;
            text-transform: none;
            white-space: pre-wrap;
        }
    
        .essential_annoucement_bar_subheading_${config.id} {
            ${fontFamily(styleConfig)}font-size: ${
      styleConfig.subheadingSize
    }px;
            color: ${styleConfig.subheadingColor};
            line-height: 1.2;
            letter-spacing: normal;
            padding: 0;
            margin: 0;
        }

        .essential_annoucement_cta_wrapper_${config.id} {
          display: flex;
          gap: 10px;
          flex-wrap: nowrap;
        }

        .essential_annoucement_bar_coupon_code_button_${config.id} {
          display: flex;
          align-items: center;
          cursor: pointer;
          text-decoration: none;
          background: none;
          border: 2px solid ${styleConfig.couponCodeButtonOutlineColor};
          white-space: nowrap;
          padding: 6px 14px;
          border-radius: ${styleConfig.couponCodeButtonBorderRadius}px;
          font-size: ${styleConfig.couponCodeButtonFontSize}px;
          color: ${styleConfig.couponCodeButtonFontColor};
          line-height: 1.5;
          gap: 10px;
          font-weight: 600;
        }

        .essential_annoucement_bar_coupon_code_button_icon_${config.id} {
            height: ${styleConfig.couponCodeButtonFontSize}px;
            width: ${styleConfig.couponCodeButtonFontSize}px;
            background-repeat: no-repeat;
            background-position: center;
            background-color: ${styleConfig.couponCodeButtonIconColor};
            -webkit-mask-image: url('data:image/svg+xml;utf8,<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.51547 1.75C2.6385 0.763422 3.4801 0 4.5 0H7.5C8.5269 0 9.37305 0.773938 9.48696 1.77035C9.48618 1.76355 9.48537 1.75677 9.48453 1.75H9.75C10.9926 1.75 12 2.75736 12 4V11.75C12 12.9926 10.9926 14 9.75 14H2.25C1.00736 14 0 12.9926 0 11.75V4C0 2.75736 1.00736 1.75 2.25 1.75H2.51547ZM4.5 1.5H7.5C7.77614 1.5 8 1.72386 8 2V3C8 3.27614 7.77614 3.5 7.5 3.5H4.5C4.22386 3.5 4 3.27614 4 3V2C4 1.72386 4.22386 1.5 4.5 1.5ZM2.51304 3.22965C2.51382 3.23645 2.51463 3.24323 2.51547 3.25H2.25C1.83579 3.25 1.5 3.58579 1.5 4V11.75C1.5 12.1642 1.83579 12.5 2.25 12.5H9.75C10.1642 12.5 10.5 12.1642 10.5 11.75V4C10.5 3.58579 10.1642 3.25 9.75 3.25H9.48453C9.3615 4.23658 8.51991 5 7.5 5H4.5C3.4731 5 2.62695 4.22606 2.51304 3.22965Z" fill="black"/></svg>');
            -webkit-mask-size: ${styleConfig.couponCodeButtonFontSize - 2}px;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-image: url('data:image/svg+xml;utf8,<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.51547 1.75C2.6385 0.763422 3.4801 0 4.5 0H7.5C8.5269 0 9.37305 0.773938 9.48696 1.77035C9.48618 1.76355 9.48537 1.75677 9.48453 1.75H9.75C10.9926 1.75 12 2.75736 12 4V11.75C12 12.9926 10.9926 14 9.75 14H2.25C1.00736 14 0 12.9926 0 11.75V4C0 2.75736 1.00736 1.75 2.25 1.75H2.51547ZM4.5 1.5H7.5C7.77614 1.5 8 1.72386 8 2V3C8 3.27614 7.77614 3.5 7.5 3.5H4.5C4.22386 3.5 4 3.27614 4 3V2C4 1.72386 4.22386 1.5 4.5 1.5ZM2.51304 3.22965C2.51382 3.23645 2.51463 3.24323 2.51547 3.25H2.25C1.83579 3.25 1.5 3.58579 1.5 4V11.75C1.5 12.1642 1.83579 12.5 2.25 12.5H9.75C10.1642 12.5 10.5 12.1642 10.5 11.75V4C10.5 3.58579 10.1642 3.25 9.75 3.25H9.48453C9.3615 4.23658 8.51991 5 7.5 5H4.5C3.4731 5 2.62695 4.22606 2.51304 3.22965Z" fill="black"/></svg>');
            mask-size: ${styleConfig.couponCodeButtonFontSize - 2}px;
            mask-repeat: no-repeat;
            mask-position: center;
            display: flex;
        }

        .essential_annoucement_bar_coupon_code_button_icon_checked_${
          config.id
        } {
            height: ${styleConfig.couponCodeButtonFontSize}px;
            width: ${styleConfig.couponCodeButtonFontSize}px;
            background-repeat: no-repeat;
            background-position: center;
            background-color: ${styleConfig.couponCodeButtonIconColor};
            -webkit-mask-image: url('data:image/svg+xml;utf8,<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.28033 6.21967C9.57322 6.51256 9.57322 6.98744 9.28033 7.28033L5.78033 10.7803C5.48744 11.0732 5.01256 11.0732 4.71967 10.7803L2.96967 9.03033C2.67678 8.73744 2.67678 8.26256 2.96967 7.96967C3.26256 7.67678 3.73744 7.67678 4.03033 7.96967L5.25 9.18934L8.21967 6.21967C8.51256 5.92678 8.98744 5.92678 9.28033 6.21967Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.51547 1.75C2.6385 0.763422 3.4801 0 4.5 0H7.5C8.5269 0 9.37305 0.773938 9.48696 1.77035C9.48618 1.76355 9.48537 1.75677 9.48453 1.75H9.75C10.9926 1.75 12 2.75736 12 4V11.75C12 12.9926 10.9926 14 9.75 14H2.25C1.00736 14 0 12.9926 0 11.75V4C0 2.75736 1.00736 1.75 2.25 1.75H2.51547ZM4.5 1.5H7.5C7.77614 1.5 8 1.72386 8 2V3C8 3.27614 7.77614 3.5 7.5 3.5H4.5C4.22386 3.5 4 3.27614 4 3V2C4 1.72386 4.22386 1.5 4.5 1.5ZM2.51304 3.22965C2.51382 3.23645 2.51463 3.24323 2.51547 3.25H2.25C1.83579 3.25 1.5 3.58579 1.5 4V11.75C1.5 12.1642 1.83579 12.5 2.25 12.5H9.75C10.1642 12.5 10.5 12.1642 10.5 11.75V4C10.5 3.58579 10.1642 3.25 9.75 3.25H9.48453C9.3615 4.23658 8.51991 5 7.5 5H4.5C3.4731 5 2.62695 4.22606 2.51304 3.22965Z" fill="black"/></svg>');
            -webkit-mask-size: ${styleConfig.couponCodeButtonFontSize - 2}px;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-image: url('data:image/svg+xml;utf8,<svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.28033 6.21967C9.57322 6.51256 9.57322 6.98744 9.28033 7.28033L5.78033 10.7803C5.48744 11.0732 5.01256 11.0732 4.71967 10.7803L2.96967 9.03033C2.67678 8.73744 2.67678 8.26256 2.96967 7.96967C3.26256 7.67678 3.73744 7.67678 4.03033 7.96967L5.25 9.18934L8.21967 6.21967C8.51256 5.92678 8.98744 5.92678 9.28033 6.21967Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.51547 1.75C2.6385 0.763422 3.4801 0 4.5 0H7.5C8.5269 0 9.37305 0.773938 9.48696 1.77035C9.48618 1.76355 9.48537 1.75677 9.48453 1.75H9.75C10.9926 1.75 12 2.75736 12 4V11.75C12 12.9926 10.9926 14 9.75 14H2.25C1.00736 14 0 12.9926 0 11.75V4C0 2.75736 1.00736 1.75 2.25 1.75H2.51547ZM4.5 1.5H7.5C7.77614 1.5 8 1.72386 8 2V3C8 3.27614 7.77614 3.5 7.5 3.5H4.5C4.22386 3.5 4 3.27614 4 3V2C4 1.72386 4.22386 1.5 4.5 1.5ZM2.51304 3.22965C2.51382 3.23645 2.51463 3.24323 2.51547 3.25H2.25C1.83579 3.25 1.5 3.58579 1.5 4V11.75C1.5 12.1642 1.83579 12.5 2.25 12.5H9.75C10.1642 12.5 10.5 12.1642 10.5 11.75V4C10.5 3.58579 10.1642 3.25 9.75 3.25H9.48453C9.3615 4.23658 8.51991 5 7.5 5H4.5C3.4731 5 2.62695 4.22606 2.51304 3.22965Z" fill="black"/></svg>');
            mask-size: ${styleConfig.couponCodeButtonFontSize - 2}px;
            mask-repeat: no-repeat;
            mask-position: center;
            display: none;
        }
        
        .essential_annoucement_bar_cta_${config.id} {
          display: block;        
          cursor: pointer;
          text-decoration: none;
          background: ${styleConfig.buttonBackgroundColor};
          border: 0;
          white-space: nowrap;
          padding: 8px 16px;
          line-height: 1.5;
          border-radius: ${styleConfig.buttonBorderRadius}px;
          font-size: ${styleConfig.buttonFontSize}px;
          color: ${styleConfig.buttonFontColor};
        }

        .essential_annoucement_bar_close_button_${config.id} {
          display: block;
          border: none;
          background: none;
          cursor: pointer;
          margin-left: auto;
        }

        .essential_annoucement_bar_close_button_${config.id} svg {
          width: 12px;
          height: 12px;
          display: block;
        }

        @media (max-width: 430px) {
          .essential_annoucement_bar_wrapper_${config.id} {
            justify-items: center;
            text-align: center;
            padding: 10px 15px;
          }

          .essential_annoucement_bar_close_button_${config.id} {
            position: absolute;
            padding: 0;
            transform: none;
            top: 5px;
            right: 2px;
          }

          .essential_annoucement_bar_wrapper_${config.id} h2,
          .essential_annoucement_bar_wrapper_${config.id} h4,
          .essential_annoucement_bar_title_container_${config.id},
          #essential_annoucement_bar_title_${config.id} {
              text-align: center;
              white-space: pre-wrap;
          }

          .essential_annoucement_main_content_wrapper_${config.id} {
            gap: ${config.announcementType !== "rotating" ? "10px" : "0"};
          }

          .essential_annoucement_bar_slide_${config.id} {
            gap: 10px;
          }

          .essential_annoucement_titles_outside_wrapper_${config.id} {
            padding: 0;
          }

          .essential_annoucement_bar_glide__arrows_${config.id} {
            display: none!important;
          }
        }

        @keyframes runningLine {
          from {
            -moz-transform: translateX(100%);
            -webkit-transform: translateX(100%);
            transform: translateX(100%);
          }
          to {
            -moz-transform: translateX(-100%);
            -webkit-transform: translateX(-100%);
            transform: translateX(-100%);
          }
        }

        @keyframes runningLine2 {
          from {
            -moz-transform: translateX(0);
            -webkit-transform: translateX(0);
            transform: translateX(0);
          }
          to {
            -moz-transform: translateX(-200%);
            -webkit-transform: translateX(-200%);
            transform: translateX(-200%);
          }
        }

        ${smallerOnMobile(config, styleConfig)}
        ${customCssStore()}
    `;

    let addedCss = "";
    if (config.announcementType === "rotating") {
      config?.announcements?.forEach((announcement, index) => {
        if (announcement.icon) {
          let iconClass = `
              .essential_annoucement_bar_icon_${config.id}_rotating_${index} {
                height: ${config.style.icon?.size}px;
                width: ${config.style.icon?.size}px;
                display: flex !important;
                ${
                  !config.style.icon?.originalColor &&
                  announcement.icon.includes(".svg") &&
                  !announcement.icon.includes("/payment-icons") &&
                  !announcement.icon.includes("/app-stores")
                    ? `background-color: ${config.style.icon?.color.hex};
                    -webkit-mask-image: url('${announcement.icon}');
                    -webkit-mask-size: ${config.style.icon?.size}px;
                    -webkit-mask-repeat: no-repeat;
                    -webkit-mask-position: center;
                    mask-image: url('${announcement.icon}');
                    mask-size: ${config.style.icon?.size}px;
                    mask-repeat: no-repeat;
                    mask-position: center;
                  `
                    : ""
                }
                ${
                  config.style.icon?.originalColor ||
                  announcement.icon.includes("/payment-icons") ||
                  announcement.icon.includes("/app-stores") ||
                  !announcement.icon.includes(".svg")
                    ? `background-image: url('${announcement.icon}');
                      background-repeat: no-repeat;
                      background-position: center;   
                      background-size: ${config.style.icon?.size}px;`
                    : ""
                }
              }
              `;
          addedCss += iconClass;
        }
      });
    }

    const addIconWrapperToCss =
      (config.announcementType === "simple" && config.icon) ||
      (config.announcementType === "rotating" &&
        config?.announcements?.some((announcement) => !!announcement?.icon));

    const iconBackgroundColor = () => {
      if (
        config.style.icon?.background?.alpha !== undefined &&
        parseFloat(config.style.icon?.background?.alpha) < 1
      ) {
        return config.style.icon?.background?.rgba;
      } else {
        return config.style.icon?.background?.hex;
      }
    };

    if (addIconWrapperToCss) {
      addedCss += `
      .essential_annoucement_bar_icon_container_${config.id} {
        display: flex !important;
        align-items: center;
        justify-content: center;
        padding: 4px;
        margin-right: -13px;
        border-radius: ${config.style.icon?.cornerRadius}px;
        background-color: ${iconBackgroundColor()};
      }

      @media (max-width: 620px) {
        .essential_annoucement_bar_icon_container_${config.id} {
          margin-right: -4px;
        }
      }
      `;
    }
    if (config.announcementType === "simple" && config.icon) {
      addedCss += `
          .essential_annoucement_bar_icon_${config.id} {
          height: ${config.style.icon?.size}px;
          width: ${config.style.icon?.size}px;
          display: flex !important;

          ${
            !config.style.icon?.originalColor &&
            config.icon.includes(".svg") &&
            !config.icon.includes("/payment-icons") &&
            !config.icon.includes("/app-stores")
              ? `background-color: ${config.style.icon?.color.hex};
          -webkit-mask-image: url('${config.icon}');
          -webkit-mask-size: ${config.style.icon?.size}px;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-image: url('${config.icon}');
          mask-size: ${config.style.icon?.size}px;
          mask-repeat: no-repeat;
          mask-position: center;`
              : ""
          }

          ${
            config.style.icon?.originalColor ||
            config.icon.includes("/payment-icons") ||
            config.icon.includes("/app-stores") ||
            !config.icon.includes(".svg")
              ? `background-image: url('${config.icon}');
              background-repeat: no-repeat;
              background-position: center;   
              background-size: ${config.style.icon?.size}px;`
              : ""
          }
        }
      `;
    }

    if (config.announcementType === "running-line") {
      appdedCss(css);
    } else {
      appdedCss(css + addedCss);
    }
  }

  function initAnnoucmentBar(
    config,
    placementNode,
    appBlockId = "",
    mountRotatingAnnouncementBar
  ) {
    const title = config.title;
    const titleLength = title.length || 20;
    const titleLengthRatio = Math.ceil(100 / titleLength);
    const animationSpeed =
      config.animationSpeed || config.animationSpeed == 0
        ? config.animationSpeed
        : 80;
    const rotateDuration = isNaN(parseInt(config.rotateDuration))
      ? 4
      : parseInt(config.rotateDuration);
    const animationSpeedReversed = 100 - animationSpeed;

    const slowAnimationDuration = titleLength * animationSpeedReversed;
    const fastAnimationDuration = slowAnimationDuration / 16;
    const animationDuration =
      titleLengthRatio < 10 ? fastAnimationDuration : slowAnimationDuration;
    const runningLineItems = titleLengthRatio < 10 ? 10 : titleLengthRatio;

    const announcementBar = document.querySelector(
      `.essential_annoucement_bar_wrapper_${config.id}_${appBlockId}`
    );
    const titleTagChangeFlag =
      config.createdAt && new Date(config.createdAt).getTime() > 1704971931000;

    const titleTag = () => {
      if (Shopify?.shop === "fd6f42-4.myshopify.com") {
        return "h4";
      }

      if (titleTagChangeFlag) {
        return "div";
      }

      return "h2";
    };

    if (announcementBar && config.announcementPlacement !== "custom") {
      return;
    }

    try {
      let localStorageData = window.localStorage.getItem(
        `essentialAnnoucementBarClosed_${config.id}_${appBlockId}`
      );
      localStorageData = JSON.parse(localStorageData);

      if (
        localStorageData &&
        localStorageData.id === config.id &&
        localStorageData.updatedAt === config.updatedAt &&
        localStorageData.value
      ) {
        return;
      }
    } catch (error) {
      console.log(error);
    }

    if (config.announcementPlacement) {
      if (config.announcementPlacement === "home-page" && !isHomePage) {
        return;
      }

      if (config.announcementPlacement === "all-products" && !isProductPage) {
        return;
      }

      if (
        config.announcementPlacement === "all-collections" &&
        !isCollectionPage
      ) {
        return;
      }
    }

    let wrapper = create({
      tag: "div",
      attributes: {
        className: `essential_annoucement_bar_wrapper essential_annoucement_bar_wrapper_${config.id} essential_annoucement_bar_wrapper_${config.id}_${appBlockId}`,
      },
    });

    if (
      config.style.position === "top-page" &&
      config.announcementPlacement !== "custom"
    ) {
      wrapper = update(wrapper, {
        attributes: {
          className: " top_page",
        },
      });
    }

    if (config.type === "cart-page" && !isCartPage) {
      wrapper = update(wrapper, {
        attributes: {
          className: " cart_drawer",
        },
      });
    }

    if (config.style.position === "top-page" && config.type !== "cart-page") {
      wrapper = update(wrapper, {
        attributes: {
          className: " top_page_styles",
        },
      });
    }

    if (
      config.style.position === "top-page" &&
      config.style.stickyBar &&
      config.announcementPlacement !== "custom"
    ) {
      wrapper = update(wrapper, {
        attributes: {
          className: " top_page_sticky",
        },
      });
    }

    if (
      config.style.position === "bottom-page" &&
      config.announcementPlacement !== "custom"
    ) {
      wrapper = update(wrapper, {
        attributes: {
          className: " bottom_page",
        },
      });
    }

    if (config.style.position === "bottom-page") {
      wrapper = update(wrapper, {
        attributes: {
          className: " bottom_page_styles",
        },
      });
    }

    if (
      config.CTAType === "clickable" &&
      config.CTALink &&
      config.announcementType !== "rotating"
    ) {
      wrapper = update(wrapper, {
        attributes: {
          className: " clickable",
        },
        events: {
          click: (event) => {
            event.preventDefault();
            if (!event.target.closest("button") && config.CTALink) {
              window.location.href = ctaHref(config.CTALink, config.createdAt);
            }
          },
        },
      });
    }

    const mainContentWrapper = create({
      tag: "div",
      attributes: {
        className: `essential_annoucement_main_content_wrapper_${config.id}`,
      },
      children: [
        config.icon &&
          config.announcementType !== "running-line" &&
          create({
            tag: "div",
            attributes: {
              id: `essential_annoucement_bar_icon_container_${config.id}`,
              className: `essential_annoucement_bar_icon_container_${config.id}`,
            },
            children: [
              create({
                tag: "div",
                attributes: {
                  id: `essential_annoucement_bar_icon_${config.id}`,
                  className: `essential_annoucement_bar_icon_${config.id}`,
                },
              }),
            ],
          }),
      ],
      appendTo: wrapper,
    });

    const TitlesOutsideWrapper = create({
      tag: "div",
      attributes: {
        className: `essential_annoucement_titles_outside_wrapper_${config.id}`,
      },
      appendTo: mainContentWrapper,
    });

    if (config.announcementType === "simple") {
      create({
        tag: "div",
        attributes: {
          className: `essential_annoucement_titles_wrapper_${config.id} ${
            !config.subheading ? "center" : ""
          }`,
        },
        children: [
          create({
            tag: titleTag(),
            attributes: {
              id: `essential_annoucement_bar_title_${config.id}`,
              className: titleTagChangeFlag
                ? `essential_annoucement_bar_title_container_${config.id} h2`
                : "",
              textContent: config.title,
            },
          }),
          config.subheading &&
            create({
              tag: "p",
              attributes: {
                className: `essential_annoucement_bar_subheading_${config.id}`,
                textContent: config.subheading,
              },
            }),
        ],
        appendTo: TitlesOutsideWrapper,
      });
    } else if (config.announcementType === "running-line") {
      const hasEmptySpaces = (inputString) => /\s{2,}/.test(inputString);

      const replaceSpacesWithHTML = (inputString) => {
        const safeInputString = inputString
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
        const spaceRegex = / +/g;

        return safeInputString.replace(spaceRegex, (match) => {
          let spaceCount = match.length;
          if (spaceCount > 1) {
            return `<span style="display:inline-block; width:${
              spaceCount * 5
            }px;"></span>`;
          } else {
            return match;
          }
        });
      };

      create({
        tag: "div",
        attributes: {
          className: `essential_annoucement_running_line_wrapper_${config.id}`,
        },
        children: [
          create({
            tag: "div",
            attributes: {
              className: `essential_annoucement_bar_running_line_title_${config.id}`,
            },
            children: Array.from(Array(runningLineItems).keys()).map(() =>
              create({
                tag: "span",
                attributes: hasEmptySpaces(config.title)
                  ? { innerHTML: replaceSpacesWithHTML(config.title) }
                  : { textContent: config.title },
              })
            ),
          }),
          create({
            tag: "div",
            attributes: {
              className: `essential_annoucement_bar_running_line_title_${config.id}`,
            },
            children: Array.from(Array(runningLineItems).keys()).map(() =>
              create({
                tag: "span",

                attributes: hasEmptySpaces(config.title)
                  ? { innerHTML: replaceSpacesWithHTML(config.title) }
                  : { textContent: config.title },
              })
            ),
          }),
        ],
        appendTo: TitlesOutsideWrapper,
      });
    } else if (config.announcementType === "rotating") {
      create({
        tag: "div",
        attributes: {
          id: `essential_annoucement_bar_slider_${config.id}_${appBlockId}`,
          className: `essential_annoucement_bar_glide`,
        },
        children: [
          create({
            tag: "div",
            attributes: {
              className: `essential_annoucement_bar_glide__track essential_annoucement_bar_glide__track_${config.id} essential_annoucement_bar_glide__track_${config.id}_${appBlockId}`,
            },
            children: [
              create({
                tag: "ul",
                attributes: {
                  className: `essential_annoucement_bar_glide__slides essential_annoucement_bar_slider_container_${config.id}`,
                },
                children: config.announcements.map((announcement, index) =>
                  create({
                    tag: "li",
                    attributes: {
                      className: `essential_annoucement_bar_glide__slide essential_annoucement_bar_slide_${
                        config.id
                      } ${
                        announcement.CTAType === "clickable" &&
                        announcement.CTALink
                          ? "clickable"
                          : ""
                      }`,
                    },
                    ...(announcement.CTAType === "clickable"
                      ? {
                          events: {
                            click: (event) => {
                              event.preventDefault();
                              if (
                                !event.target.closest("a") &&
                                announcement.CTALink
                              ) {
                                window.location.href = ctaHref(
                                  announcement.CTALink,
                                  config.createdAt
                                );
                              }
                            },
                          },
                        }
                      : {}),
                    children: [
                      announcement?.icon &&
                        create({
                          tag: "div",
                          attributes: {
                            id: `essential_annoucement_bar_icon_container_${config.id}_rotating_${index}`,
                            className: `essential_annoucement_bar_icon_container_${config.id}`,
                          },
                          children: [
                            create({
                              tag: "div",
                              attributes: {
                                id: `essential_annoucement_bar_icon_${config.id}_rotating_${index}`,
                                className: `essential_annoucement_bar_icon_${config.id}_rotating_${index}`,
                              },
                            }),
                          ],
                        }),
                      create({
                        tag: "div",
                        attributes: {
                          className: `essential_annoucement_titles_wrapper_${
                            config.id
                          } ${!announcement.subheading ? "center" : ""}`,
                        },
                        children: [
                          create({
                            tag: titleTag(),
                            attributes: {
                              className: `essential_annoucement_bar_title_${
                                config.id
                              } ${
                                titleTagChangeFlag
                                  ? `essential_annoucement_bar_title_container_${config.id} h2`
                                  : ""
                              }`,
                              textContent: announcement.title,
                            },
                          }),
                          announcement.subheading &&
                            create({
                              tag: "p",
                              attributes: {
                                className: `essential_annoucement_bar_subheading_${config.id}`,
                                textContent: announcement.subheading,
                              },
                            }),
                        ],
                      }),
                      announcement.couponCode &&
                        create({
                          tag: "div",
                          attributes: {
                            className: `essential_annoucement_cta_wrapper_${config.id}`,
                          },
                          children: [
                            announcement.couponCode &&
                              create({
                                tag: "div",
                                attributes: {
                                  className: `essential_annoucement_bar_coupon_code_button_${config.id} essential_coupon_code_rotating_${index}`,
                                  id: `essential_annoucement_bar_coupon_code_button_${config.id}`,
                                  textContent: announcement.couponCode,
                                },
                                events: {
                                  click: () => {
                                    navigator.clipboard.writeText(
                                      announcement.couponCode
                                    );
                                    // hide the icon
                                    document
                                      .querySelectorAll(
                                        `.essential_annoucement_bar_coupon_code_button_icon_${config.id}.essential_icon_rotating_${index}`
                                      )
                                      .forEach(
                                        (icon) => (icon.style.display = "none")
                                      );
                                    // show the checked icon
                                    document
                                      .querySelectorAll(
                                        `.essential_annoucement_bar_coupon_code_button_icon_checked_${config.id}.essential_icon_rotating_${index}`
                                      )
                                      .forEach(
                                        (icon) => (icon.style.display = "flex")
                                      );
                                  },
                                },
                                children: [
                                  create({
                                    tag: "div",
                                    attributes: {
                                      className: `essential_annoucement_bar_coupon_code_button_icon_${config.id} essential_icon_rotating_${index}`,
                                    },
                                    children: [
                                      create({
                                        tag: "div",
                                      }),
                                    ],
                                  }),
                                  create({
                                    tag: "div",
                                    attributes: {
                                      className: `essential_annoucement_bar_coupon_code_button_icon_checked_${config.id} essential_icon_rotating_${index}`,
                                    },
                                    children: [
                                      create({
                                        tag: "div",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            announcement.CTAType === "button" &&
                              create({
                                tag: "a",
                                attributes: {
                                  className: `essential_annoucement_bar_cta_${config.id}`,
                                  href: ctaHref(
                                    announcement.CTALink,
                                    config.createdAt
                                  ),
                                  textContent: announcement.buttonText || "",
                                },
                              }),
                          ],
                        }),
                      !announcement.couponCode &&
                        announcement.CTAType === "button" &&
                        create({
                          tag: "a",
                          attributes: {
                            className: `essential_annoucement_bar_cta_${config.id}`,
                            href: ctaHref(
                              announcement.CTALink,
                              config.createdAt
                            ),
                            textContent: announcement.buttonText || "",
                          },
                        }),
                    ],
                  })
                ),
              }),
            ],
          }),
          create({
            tag: "div",
            attributes: {
              className: `essential_annoucement_bar_glide__arrows_${config.id} essential_annoucement_bar_glide__arrows_${config.id}_${appBlockId}`,
            },
            children: [
              create({
                tag: "div",
                attributes: {
                  className: `essential_annoucement_bar_glide__arrow essential_annoucement_bar_glide__arrows_prev_${config.id} essential_annoucement_bar_glide__arrows_prev_${config.id}_${appBlockId}`,
                },
                children: [prevButtonIconSVG(config.style.arrowIconColor)],
              }),
              create({
                tag: "div",
                attributes: {
                  className: `essential_annoucement_bar_glide__arrow essential_annoucement_bar_glide__arrows_next_${config.id} essential_annoucement_bar_glide__arrows_next_${config.id}_${appBlockId}`,
                },
                children: [nextButtonIconSVG(config.style.arrowIconColor)],
              }),
            ],
          }),
        ],
        appendTo: TitlesOutsideWrapper,
      });
    }
    let CtaWrapper = null;
    if (
      config.couponCode &&
      config.CTAType === "button" &&
      config.announcementType !== "rotating"
    ) {
      CtaWrapper = create({
        tag: "div",
        attributes: {
          className: `essential_annoucement_cta_wrapper_${config.id}`,
        },
        appendTo: mainContentWrapper,
      });
    }

    if (config.couponCode && config.announcementType !== "rotating") {
      create({
        tag: "div",
        attributes: {
          className: `essential_annoucement_bar_coupon_code_button_${config.id}`,
          id: `essential_annoucement_bar_coupon_code_button_${config.id}`,
          textContent: config.couponCode,
        },
        events: {
          click: () => {
            navigator.clipboard.writeText(config.couponCode);
            // hide the icon
            document.querySelector(
              `.essential_annoucement_bar_coupon_code_button_icon_${config.id}`
            ).style.display = "none";
            // show the checked icon
            document.querySelector(
              `.essential_annoucement_bar_coupon_code_button_icon_checked_${config.id}`
            ).style.display = "flex";
          },
        },
        children: [
          create({
            tag: "div",
            attributes: {
              className: `essential_annoucement_bar_coupon_code_button_icon_${config.id}`,
            },
            children: [
              create({
                tag: "div",
              }),
            ],
          }),
          create({
            tag: "div",
            attributes: {
              className: `essential_annoucement_bar_coupon_code_button_icon_checked_${config.id}`,
            },
            children: [
              create({
                tag: "div",
              }),
            ],
          }),
        ],
        appendTo: CtaWrapper ? CtaWrapper : mainContentWrapper,
      });
    }

    if (config.CTAType === "button" && config.announcementType !== "rotating") {
      create({
        tag: "a",
        attributes: {
          className: `essential_annoucement_bar_cta_${config.id}`,
          href: ctaHref(config.CTALink, config.createdAt),
          textContent: config.buttonText,
        },
        appendTo: CtaWrapper ? CtaWrapper : mainContentWrapper,
      });
    }

    if (config.closeButton) {
      create({
        tag: "button",
        attributes: {
          className: `essential_annoucement_bar_close_button_${config.id}`,
        },
        events: {
          click: (event) => {
            event.preventDefault();
            const announcementBar = document.querySelector(
              `.essential_annoucement_bar_wrapper_${config.id}_${appBlockId}`
            );
            if (announcementBar) {
              announcementBar.parentNode.removeChild(announcementBar);
              try {
                window.localStorage.setItem(
                  `essentialAnnoucementBarClosed_${config.id}_${appBlockId}`,
                  JSON.stringify({
                    value: true,
                    id: config.id,
                    updatedAt: config.updatedAt,
                  })
                );
              } catch (error) {
                console.log(error);
              }
            }
          },
        },
        children: [closeButtonIconSVG(config.style.closeIconColor)],
        appendTo: wrapper,
      });
    }

    appendAnnoucementBarCss(config, animationDuration);

    if (placementNode) {
      placementNode.prepend(wrapper);
    } else {
      const defaultPlacementNode = document.querySelector(
        ".essential-announcement-bar-placement"
      );
      if (defaultPlacementNode) {
        defaultPlacementNode.prepend(wrapper);
      } else {
        document.querySelector("body").prepend(wrapper);
      }
    }

    if (config.announcementType === "rotating") {
      const sliderTrack = document.querySelector(
        `.essential_annoucement_bar_glide__track_${config.id}_${appBlockId}`
      );
      const slideArrows = document.querySelector(
        `.essential_annoucement_bar_glide__arrows_${config.id}_${appBlockId}`
      );
      const prevArrow = document.querySelector(
        `.essential_annoucement_bar_glide__arrows_prev_${config.id}_${appBlockId}`
      );
      const newxArrow = document.querySelector(
        `.essential_annoucement_bar_glide__arrows_next_${config.id}_${appBlockId}`
      );
      sliderTrack.setAttribute("data-glide-el", "track");
      slideArrows.setAttribute("data-glide-el", "controls");
      prevArrow.setAttribute("data-glide-dir", "<");
      newxArrow.setAttribute("data-glide-dir", ">");

      // if glide library exists
      if (typeof Glide === "function") {
        const glide = new Glide(
          `#essential_annoucement_bar_slider_${config.id}_${appBlockId}`,
          {
            type: "carousel",
            animationDuration: window.essentialAnimationDuration
              ? window.essentialAnimationDuration
              : 400,
            autoplay: rotateDuration * 1000,
          }
        );
        window.essentialAnnouncementMounted = false;
        window.addEventListener("load", () => {
          if (!window.essentialAnnouncementMounted) {
            glide.mount();
            if (
              Shopify.shop === "blitz-brand-apparel.myshopify.com" ||
              Shopify.shop === "miarcus.myshopify.com" ||
              Shopify.shop === "illuminatebyliana.myshopify.com"
            ) {
              window.essentialAnnouncementMounted = true;
            }
          }

          if (config.type === "cart-page" && !isCartPage) {
            const resizeObserver = new ResizeObserver((value) => {
              glide.update();
            });

            resizeObserver.observe(
              document.querySelector(
                `.essential_annoucement_bar_wrapper_${config.id}`
              )
            );
          }
        });

        if (
          (Shopify.shop === "blitz-brand-apparel.myshopify.com" ||
            Shopify.shop === "miarcus.myshopify.com" ||
            Shopify.shop === "illuminatebyliana.myshopify.com") &&
          !window.essentialAnnouncementMounted
        ) {
          setTimeout(() => {
            glide.mount();
            window.essentialAnnouncementMounted = true;
          }, 500);
        }

        if (mountRotatingAnnouncementBar) {
          setTimeout(() => {
            glide.mount();
          }, 200);
        }
      }
    }
  }

  function addAnnouncementBar() {
    const announcementBlocks = document.querySelectorAll(
      "div.essential-announcement-block"
    );

    const canShowOnProduct = (config) => {
      if (config.showOnProducts && config.showOnProducts.length !== 0) {
        const pathname = decodeURI(window.location.pathname);
        const productData = window.essentialAnnouncementMeta?.productData;
        const productID = productData?.id;

        const showOnProduct = config.showOnProducts.find((product) => {
          if (productID && product.id) {
            return product.id.includes(productID);
          }

          if (typeof pathname.endsWith === "function") {
            return pathname.endsWith(`products/${product.handle}`);
          } else {
            return pathname.includes(`products/${product.handle}`);
          }
        });

        if (!showOnProduct) {
          return false;
        }
      }

      if (
        config.showOnProductsInCollections &&
        config.showOnProductsInCollections.length !== 0
      ) {
        const productCollections = essentialsMeta.productCollections || [];
        const showOnProduct = config.showOnProductsInCollections.find(
          (collection) => {
            const collectionId = Number(collection.id.split("/").pop());
            return productCollections.some(
              (product) => product.id === collectionId
            );
          }
        );

        if (!showOnProduct) {
          return false;
        }
      }

      return true;
    };

    const canShowOnCollection = (config) => {
      if (config.showOnCollections && config.showOnCollections.length !== 0) {
        const pathname = decodeURI(window.location.pathname);

        if (
          !essentialsMeta?.templateName.includes("collection") &&
          Shopify?.shop === "moose-marketplace.myshopify.com"
        ) {
          return false;
        }

        let showOnCollection;

        if (Shopify.shop === "wr1c5i-qb.myshopify.com") {
          showOnCollection =
            window.essentialAnnouncementMeta?.collectionId &&
            config.showOnCollections.find((collection) =>
              collection.id.includes(
                window.essentialAnnouncementMeta?.collectionId
              )
            );
        } else {
          showOnCollection = config.showOnCollections.find(
            (collection) =>
              pathname.includes(`collections/${collection.handle}`) &&
              !isProductPage
          );
        }
        if (!showOnCollection) {
          return false;
        }
      }

      return true;
    };

    const canShowInCountry = (
      config,
      clientCountry,
      isClientCountrySelected
    ) => {
      if (config.locationType === "on-countries" && !clientCountry) {
        return false;
      }
      if (
        (config.locationType !== "on-countries" && !isClientCountrySelected) ||
        !clientCountry
      ) {
        return true;
      }
      if (
        config.locationType === "on-countries" &&
        isClientCountrySelected &&
        config?.showInCountries?.includes(clientCountry)
      ) {
        return true;
      }
      return false;
    };

    const getCleanTranslation = (translation) => {
      const cleanedTranslation = Object.keys(translation).reduce((acc, key) => {
        if (
          translation[key] !== null &&
          translation[key] !== "" &&
          !["id", "itemId", "itemType", "locale"].includes(key)
        ) {
          acc[key] = translation[key];
        }
        return acc;
      }, {});
      return cleanedTranslation;
    };

    getConfig().then(async (configs) => {
      if (!configs) {
        return null;
      }

      const isCountriesSelected = configs?.some(
        (announcement) => announcement.locationType === "on-countries"
      );

      let clientCountry;
      if (isCountriesSelected) {
        try {
          clientCountry = await essentialFetchGeolocation();
        } catch (error) {
          console.error("Error fetching geolocation:", error);
        }
      }

      const isClientCountrySelected = configs?.some(
        (announcement) =>
          announcement.showInCountries &&
          announcement.showInCountries.includes(clientCountry)
      );

      configs.forEach((config) => {
        const translationType =
          config.announcementType === "rotating" ? "list" : "single";
        const itemType = config.announcementType;

        if (config.translations && config.translations.length > 0) {
          if (translationType === "single") {
            const translation = config.translations.find(
              (translation) =>
                translation.locale === Shopify?.locale &&
                translation.itemType === itemType
            );

            if (translation) {
              Object.assign(config, getCleanTranslation(translation));
            }
          }

          if (translationType === "list") {
            const items = config.announcements;
            items.forEach((item) => {
              const translation = config.translations.find(
                (translation) =>
                  translation.locale === Shopify?.locale &&
                  translation.itemType === itemType &&
                  translation.itemId === item.id
              );

              if (translation) {
                Object.assign(item, getCleanTranslation(translation));
              }
            });
          }
        }
      });

      const appEmbeds = configs.filter(
        (config) =>
          config.announcementPlacement !== "custom" &&
          config.type !== "cart-page"
      );
      const appBlocks = configs.filter(
        (config) =>
          config.announcementPlacement === "custom" ||
          config.type === "cart-page"
      );

      const cartPageAnnouncements = configs.filter(
        (config) => config.type === "cart-page"
      );

      if ((configs && !Array.isArray(configs)) || configs.length === 0) {
        return null;
      }
      if (isCartPage) {
        cartPageAnnouncements.forEach((announcementBarConfig) => {
          const root = window.Shopify?.routes?.root || "/";
          const cartFormAll = document.querySelectorAll(
            `form[action="${root}cart"]`
          );
          const cartPageTopPlacementNode = cartFormAll[cartFormAll.length - 1];
          const codeSnippetUsed = document.querySelector(
            `div.essential-announcement-block[id="${announcementBarConfig?.id}"]`
          );

          if (
            !codeSnippetUsed &&
            announcementBarConfig &&
            announcementBarConfig.announcementPlacement !== "custom" &&
            isAnnouncementActive(announcementBarConfig) &&
            canShowInCountry(
              announcementBarConfig,
              clientCountry,
              isClientCountrySelected
            )
          ) {
            initAnnoucmentBar(
              announcementBarConfig,
              cartPageTopPlacementNode.parentNode
            );
          }
        });
      }

      if (sideCartNode() && !isCartPage) {
        const cartPageTopPlacementNode = sideCartNode();
        let announcementBarsAdded = [];
        cartPageAnnouncements.forEach((announcementBarConfig) => {
          if (
            announcementBarConfig &&
            announcementBarConfig.announcementPlacement !== "custom" &&
            isAnnouncementActive(announcementBarConfig) &&
            canShowInCountry(
              announcementBarConfig,
              clientCountry,
              isClientCountrySelected
            )
          ) {
            initAnnoucmentBar(announcementBarConfig, cartPageTopPlacementNode);
            announcementBarsAdded.push(announcementBarConfig);
          }
        });

        const observer = new MutationObserver(() => {
          placementNode = sideCartNode();
          announcementBarsAdded.forEach((config) => {
            if (
              placementNode &&
              !placementNode.querySelector(
                `.essential_annoucement_bar_wrapper_${config.id}`
              )
            ) {
              initAnnoucmentBar(config, placementNode, "", true);
            }
          });
        });

        if (announcementBarsAdded.length > 0) {
          let observerParentLimit = 3;
          if (
            cartPageTopPlacementNode &&
            Array.from(cartPageTopPlacementNode.classList).includes(
              "cart-drawer__items"
            )
          ) {
            observerParentLimit = 1;
          }
          let count = 0;
          let currentPlacementNode = cartPageTopPlacementNode;
          while (
            currentPlacementNode.parentNode &&
            currentPlacementNode.parentNode.tagName !== "BODY" &&
            currentPlacementNode.parentNode.tagName !== "HTML" &&
            count < observerParentLimit
          ) {
            currentPlacementNode = currentPlacementNode.parentNode;
            count++;
          }
          const observerNode = currentPlacementNode;

          observer.observe(observerNode, {
            childList: true,
            subtree: true,
          });
        }
      }

      appEmbeds.forEach((announcementBarConfig) => {
        if (
          announcementBarConfig &&
          isAnnouncementActive(announcementBarConfig) &&
          canShowOnProduct(announcementBarConfig) &&
          canShowOnCollection(announcementBarConfig) &&
          canShowInCountry(
            announcementBarConfig,
            clientCountry,
            isClientCountrySelected
          )
        ) {
          initAnnoucmentBar(announcementBarConfig);
        }
      });

      // loop through announcementBlocks and if it's in appBlocks then initAnnoucmentBar
      announcementBlocks.forEach((announcementBlockNode) => {
        const config = appBlocks.find(
          (config) => config.id === announcementBlockNode.getAttribute("id")
        );
        // get parent node id find by class shopify-app-block
        const appBlockParentNode =
          announcementBlockNode.closest(".shopify-app-block");
        // get parent node id if appBlockParentNode exist
        const appBlockParentNodeId = appBlockParentNode
          ? appBlockParentNode.getAttribute("id")
          : "";

        if (
          config &&
          isAnnouncementActive(config) &&
          canShowOnProduct(config) &&
          canShowOnCollection(config) &&
          canShowInCountry(config, clientCountry, isClientCountrySelected)
        ) {
          initAnnoucmentBar(
            config,
            announcementBlockNode,
            appBlockParentNodeId
          );
        }
      });
    });
  }

  const essentialFetchGeolocation = async () => {
    let clientCountry;
    try {
      const geolocationUrl =
        "https://essential-announcement-bar.cc/api/geolocation";
      const response = await fetch(geolocationUrl);

      if (response.headers.has("country")) {
        clientCountry = response.headers.get("country");
      }
    } catch (error) {
      console.error("Error fetching geolocation", error);
    }
    return clientCountry;
  };

  function hasEnded(config) {
    if (!config.endDate) {
      return false;
    }

    const currentDate = new Date().getTime();
    const endDate = new Date(config.endDate);
    return currentDate >= endDate;
  }

  function isScheduled(config) {
    if (!config.startDate) {
      return false;
    }

    const currentDate = new Date().getTime();
    const startDate = new Date(config.startDate);
    return currentDate < startDate;
  }

  function isAnnouncementActive(config) {
    return !isScheduled(config) && !hasEnded(config);
  }

  function essentialAnnouncementsCountViews() {
    if (Shopify.shop === "3f80fc.myshopify.com") {
      return;
    }

    let views = 0;
    const shop = window.Shopify ? window.Shopify.shop : window.location.origin;
    const bars = document.querySelectorAll(
      ".essential_annoucement_bar_wrapper:not(.cart_drawer)"
    );

    if (bars && bars.length > 0) {
      views += bars.length;
    }

    if (!views || !shop) {
      return;
    }

    fetch("https://essential-apps-analytics.herokuapp.com/announcement_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shop, views }),
    });
  }

  if (
    Shopify.shop === "7c1e1d.myshopify.com" &&
    document.querySelector(".essential_annoucement_bar_wrapper")
  ) {
    return;
  }

  addAnnouncementBar();
  window.triggeraddAnnouncementBar = addAnnouncementBar;

  setTimeout(() => {
    essentialAnnouncementsCountViews();
  }, 200);
})();
