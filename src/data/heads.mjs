// <head> markup per page type. %TITLE% is replaced with the page title.
// The SEO tags (description, canonical, social tags, schema) are added by src/layouts/Base.astro.
export const heads = {
  "editorial": {
    "pre": "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>%TITLE%</title><link rel=\"icon\" href=\"assets/brand/logo-48.png\"><link rel=\"stylesheet\" href=\"seo-editorial.css\">",
    "mid": "",
    "post": ""
  },
  "category": {
    "pre": "<meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"theme-color\" content=\"#171717\"><title>%TITLE%</title><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin><link href=\"https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\"><link rel=\"stylesheet\" href=\"styles.css?v=20260908-seo1\"><link rel=\"stylesheet\" href=\"services.css?v=20260908-seo1\"><link rel=\"stylesheet\" href=\"category-detail.css?v=20260908-seo1\"><link rel=\"icon\" type=\"image/png\" sizes=\"48x48\" href=\"assets/brand/logo-48.png\"><link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"assets/brand/logo-180.png\">",
    "mid": "<link rel=\"stylesheet\" href=\"implementation-seo.css?v=20260912\">",
    "post": ""
  },
  "contact": {
    "pre": "\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  \n  <meta name=\"theme-color\" content=\"#171717\" />\n  <title>%TITLE%</title>\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"styles.css?v=20260911-fix6\" />\n  <link rel=\"stylesheet\" href=\"contact.css?v=20260911-contact2\" />\n<link rel=\"icon\" type=\"image/png\" sizes=\"48x48\" href=\"assets/brand/logo-48.png\"><link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"assets/brand/logo-180.png\">",
    "mid": "",
    "post": ""
  },
  "guide": {
    "pre": "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>%TITLE%</title><link rel=\"icon\" href=\"assets/brand/logo-48.png\"><link rel=\"stylesheet\" href=\"seo-editorial.css\">",
    "mid": "",
    "post": "<link rel=\"stylesheet\" href=\"implementation-seo.css?v=20260912\">"
  },
  "index": {
    "pre": "\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  \n  <meta name=\"theme-color\" content=\"#f4f0e8\" />\n  <title>%TITLE%</title>\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"styles.css?v=20260912-instagram1\" />\n  <link rel=\"stylesheet\" href=\"immersive-experience.css?v=20260908-seo1\" />\n  <link rel=\"stylesheet\" href=\"team-map.css?v=20260911-fix5\" />\n  <link rel=\"stylesheet\" href=\"home-services.css?v=20260928-click1\" />\n  <link rel=\"stylesheet\" href=\"hero-video.css?v=20260928-video1\" />\n  <link rel=\"stylesheet\" href=\"founder-about.css?v=20260908-seo1\" />\n<link rel=\"icon\" type=\"image/png\" sizes=\"48x48\" href=\"assets/brand/logo-48.png\"><link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"assets/brand/logo-180.png\">",
    "mid": "",
    "post": ""
  },
  "service": {
    "pre": "<meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"theme-color\" content=\"#171717\"><title>%TITLE%</title><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin><link href=\"https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\"><link rel=\"stylesheet\" href=\"styles.css?v=20260908-seo1\"><link rel=\"stylesheet\" href=\"services.css?v=20260908-seo1\"><link rel=\"stylesheet\" href=\"category-detail.css?v=20260908-seo1\"><link rel=\"icon\" type=\"image/png\" sizes=\"48x48\" href=\"assets/brand/logo-48.png\"><link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"assets/brand/logo-180.png\">",
    "mid": "",
    "post": ""
  },
  "services": {
    "pre": "\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  \n  <meta name=\"theme-color\" content=\"#171717\" />\n  <title>%TITLE%</title>\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n  <link href=\"https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap\" rel=\"stylesheet\" />\n  <link rel=\"stylesheet\" href=\"styles.css?v=20260908-seo1\" />\n  <link rel=\"stylesheet\" href=\"services.css?v=20260908-seo1\" />\n<link rel=\"icon\" type=\"image/png\" sizes=\"48x48\" href=\"assets/brand/logo-48.png\"><link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"assets/brand/logo-180.png\">",
    "mid": "",
    "post": ""
  }
};
