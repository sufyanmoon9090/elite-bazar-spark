import { Helmet } from "react-helmet-async";

/**
 * Central SEO component.
 * Renders per-route <title>, meta description, canonical, Open Graph,
 * Twitter Card tags and (optionally) JSON-LD structured data.
 */

export const SITE_URL = "https://elite-bazar.lovable.app";
export const SITE_NAME = "Elite Bazar";

interface SEOProps {
  title: string;
  description: string;
  /** Route path, e.g. "/shop" — used for canonical + og:url */
  path?: string;
  image?: string;
  /** og:type — "website" for listings, "product" for product pages */
  type?: "website" | "product" | "article";
  noindex?: boolean;
  /** One or more JSON-LD objects (Product, BreadcrumbList, Organization...) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SEO = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Structured data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
