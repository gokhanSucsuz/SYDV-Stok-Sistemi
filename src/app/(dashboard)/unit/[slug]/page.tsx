import UnitPanelClient from "./UnitPanelClient";

export function generateStaticParams() {
  return [
    { slug: "asevi" },
    { slug: "dergah" },
    { slug: "vefa" },
    { slug: "vakif" },
    { slug: "bagis" },
  ];
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <UnitPanelClient slug={resolvedParams.slug} />;
}
