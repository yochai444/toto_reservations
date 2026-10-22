import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { CategoryChips } from "@/components/category-chips";
import { CategoryNote, MenuHead, MenuSection, MenuSectionHead } from "@/components/home/site-styles";
import { MenuCardTall } from "@/components/menu-card";
import { Crown, DishGrid, Muted, PinkBand, Wrap } from "@/components/ui/primitives";
import { getMenu } from "@/lib/menu";

export const metadata: Metadata = { title: "התפריט" };

const MenuPage = async () => {
  const menu = await getMenu();
  return (
    <>
      <PinkBand>
        <MenuHead>
          <Box component="h1">התפריט של טוטו</Box>
          <Box component="p">כל המחירים למגש · חלבי, כשר למהדרין · תפריט 2026</Box>
        </MenuHead>
      </PinkBand>

      <CategoryChips categories={menu.categories} />

      <Wrap>
        {menu.categories.map((c) => (
          <MenuSection key={c.id} id={`cat-${c.id}`} data-sec={c.id}>
            <MenuSectionHead>
              <Box component="h2">
                <Crown style={{ height: 28, width: "auto" }} />
                {c.name}
              </Box>
              <CategoryNote>{c.note}</CategoryNote>
            </MenuSectionHead>
            <DishGrid wide>
              {menu.items
                .filter((i) => i.categoryId === c.id)
                .map((it) => (
                  <MenuCardTall key={it.id} item={it} />
                ))}
            </DishGrid>
          </MenuSection>
        ))}
        <Muted sx={{ pt: 5, pb: 15, textAlign: "center" }}>זה כל התפריט. משהו חסר? כתבו לנו בוואטסאפ ונשמח להתאים.</Muted>
      </Wrap>
    </>
  );
};

export default MenuPage;
