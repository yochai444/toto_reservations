import type { Metadata } from "next";
import { CategoryChips } from "@/components/category-chips";
import { CategoryNote, MenuHead, MenuSection, MenuSectionHead } from "@/components/home/site-styles";
import { MenuCard } from "@/components/menu-card";
import { Crown, DishGrid, Muted, PinkBand, Wrap } from "@/components/ui/primitives";
import { getMenu } from "@/lib/menu";

export const metadata: Metadata = { title: "התפריט" };

export default async function MenuPage() {
  const menu = await getMenu();
  return (
    <>
      <PinkBand>
        <MenuHead>
          <h1>התפריט של טוטו</h1>
          <p>כל המחירים למגש · חלבי, כשר למהדרין · תפריט 2026</p>
        </MenuHead>
      </PinkBand>

      <CategoryChips categories={menu.categories} />

      <Wrap>
        {menu.categories.map((c) => (
          <MenuSection key={c.id} id={`cat-${c.id}`} data-sec={c.id}>
            <MenuSectionHead>
              <h2>
                <Crown style={{ height: 28, width: "auto" }} />
                {c.name}
              </h2>
              <CategoryNote>{c.note}</CategoryNote>
            </MenuSectionHead>
            <DishGrid>
              {menu.items
                .filter((i) => i.categoryId === c.id)
                .map((it) => (
                  <MenuCard key={it.id} item={it} />
                ))}
            </DishGrid>
          </MenuSection>
        ))}
        <Muted sx={{ pt: 5, pb: 15, textAlign: "center" }}>זה כל התפריט. משהו חסר? כתבו לנו בווצאפ ונשמח להתאים.</Muted>
      </Wrap>
    </>
  );
}
