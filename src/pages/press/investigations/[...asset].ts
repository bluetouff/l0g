import type { APIRoute } from 'astro';
import { pressPackages, buildPressSvg, buildPressCsv, buildPressMethod, buildPressCitation } from '../../../lib/press-packages.ts';
import type { PressLocale, PressPackage } from '../../../lib/press-packages.ts';

const formats = {
  'figure.svg': { build: buildPressSvg, type: 'image/svg+xml; charset=utf-8' },
  'data.csv': { build: buildPressCsv, type: 'text/csv; charset=utf-8' },
  'method.txt': { build: buildPressMethod, type: 'text/plain; charset=utf-8' },
  'citation.txt': { build: buildPressCitation, type: 'text/plain; charset=utf-8' },
};
type Format = keyof typeof formats;

export function getStaticPaths() {
  return pressPackages.flatMap((pack) => (['fr', 'en'] as const).flatMap((locale) =>
    (Object.keys(formats) as Format[]).map((format) => ({
      params: { asset: `${pack.id}/${locale}/${format}` },
      props: { pack, locale, format },
    })),
  ));
}

export const GET: APIRoute = ({ props }) => {
  const { pack, locale, format } = props as { pack: PressPackage; locale: PressLocale; format: Format };
  const output = formats[format];
  return new Response(output.build(pack, locale), {
    headers: {
      'Content-Type': output.type,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=300, must-revalidate',
      ...(format === 'data.csv' ? { 'Content-Disposition': `attachment; filename="l0g-${pack.id}-${locale}.csv"` } : {}),
    },
  });
};
