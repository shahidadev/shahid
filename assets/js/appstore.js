(() => {
  "use strict";

  const APPSTORE_URL = "/assets/json/appstore.json";
  const CACHE_KEY = "appstore-json-v1";

  const sectionMap = {
    open_source_apps: "open_source_apps",
    most_used_apps: "most_used_apps"
  };

  const buttonLabelMap = {
    web: "Web",
    android: "Android",
    android_tv: "Android TV",
    android_app: "Android",
    android_tv_app: "Android TV",
    telegram: "Telegram",
    github: "GitHub",
    download: "Download"
  };

  const buttonLogoMap = {
    web: "web",
    android: "android",
    android_tv: "android_tv",
    android_app: "android",
    android_tv_app: "android_tv",
    telegram: "telegram",
    github: "github",
    download: "download"
  };

  const gridNodes = Array.from(document.querySelectorAll("[data-app-grid]"));

  const safeParse = (raw) => {
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  };

  const readCache = () => {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = safeParse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.raw) {
      return null;
    }
    const data = safeParse(parsed.raw);
    if (!data) {
      return null;
    }
    return { raw: parsed.raw, data };
  };

  const writeCache = (raw) => {
    const payload = JSON.stringify({ raw });
    localStorage.setItem(CACHE_KEY, payload);
  };

  const normalizeLinks = (value) => {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  };

  const createButton = (type, url, logos) => {
    const anchor = document.createElement("a");
    anchor.className = "app-btn";
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    const label = buttonLabelMap[type] || type;
    const logoKey = buttonLogoMap[type] || type;
    const logoSrc = logos && logos[logoKey] ? logos[logoKey] : "";

    if (logoSrc) {
      const img = document.createElement("img");
      img.src = logoSrc;
      img.alt = label + " logo";
      anchor.appendChild(img);
    }

    const text = document.createElement("span");
    text.textContent = label;
    anchor.appendChild(text);

    return anchor;
  };

  const renderSection = (key, apps, logos) => {
    const grid = gridNodes.find((node) => node.dataset.appGrid === key);
    if (!grid) {
      return;
    }

    grid.innerHTML = "";

    if (!Array.isArray(apps) || apps.length === 0) {
      const empty = document.createElement("div");
      empty.className = "app-placeholder";
      empty.textContent = "No apps found.";
      grid.appendChild(empty);
      return;
    }

    apps.forEach((app) => {
      const card = document.createElement("div");
      card.className = "app-card";

      const top = document.createElement("div");
      top.className = "app-top";

      const logoWrap = document.createElement("div");
      logoWrap.className = "app-logo";

      const logoImg = document.createElement("img");
      logoImg.src = app.logo || "";
      logoImg.alt = app.name ? app.name + " logo" : "App logo";
      logoWrap.appendChild(logoImg);

      const name = document.createElement("p");
      name.className = "app-name";
      name.textContent = app.name || "Untitled";

      const description = document.createElement("p");
      description.className = "app-description";
      description.textContent = app.description || "";

      top.appendChild(logoWrap);
      const meta = document.createElement("div");
      meta.className = "app-meta";
      meta.appendChild(name);
      if (description.textContent) {
        meta.appendChild(description);
      }
      top.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "app-actions";

      Object.keys(app)
        .filter((keyName) => !["name", "logo", "description"].includes(keyName))
        .forEach((keyName) => {
          const urls = normalizeLinks(app[keyName]);
          urls.forEach((url) => {
            actions.appendChild(createButton(keyName, url, logos));
          });
        });

      card.appendChild(top);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  };

  const renderAll = (data) => {
    if (!data) {
      return;
    }
    const logos = data.button_logos || {};
    Object.keys(sectionMap).forEach((key) => {
      renderSection(sectionMap[key], data[key], logos);
    });
  };

  const fetchAndUpdate = (cachedRaw) => {
    return fetch(APPSTORE_URL, { cache: "no-store" })
      .then((response) => response.text())
      .then((raw) => {
        if (!raw) {
          return;
        }
        if (raw === cachedRaw) {
          return;
        }
        const data = safeParse(raw);
        if (!data) {
          return;
        }
        writeCache(raw);
        renderAll(data);
      })
      .catch(() => {
        return;
      });
  };

  const init = () => {
    const cached = readCache();
    if (cached) {
      renderAll(cached.data);
    }

    const startFetch = () => {
      const cachedRaw = cached ? cached.raw : "";
      fetchAndUpdate(cachedRaw);
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startFetch, { timeout: 2000 });
    } else {
      window.setTimeout(startFetch, 800);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
