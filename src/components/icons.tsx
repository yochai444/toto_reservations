import { styled } from "@mui/material/styles";
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

// SvgIcon fills with currentColor through CSS, which would fill these outline icons.
const StrokeIcon = styled(SvgIcon)({ fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" });

export const BagIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="2" {...p}>
    <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </StrokeIcon>
);

export const SearchIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="2.4" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </StrokeIcon>
);

export const InstagramIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="2" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </StrokeIcon>
);

export const FacebookIcon = (p: SvgIconProps) => (
  <SvgIcon {...p}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.1H7.6v3h2.6V21h3.3Z" />
  </SvgIcon>
);

export const TiktokIcon = (p: SvgIconProps) => (
  <SvgIcon {...p}>
    <path d="M16.6 3c.3 2.2 1.7 3.7 3.9 3.9v3.1a7.4 7.4 0 0 1-3.9-1.2v6.3A6 6 0 1 1 10.6 9v3.2a2.8 2.8 0 1 0 2.8 2.9V3h3.2Z" />
  </SvgIcon>
);

export const WhatsappIcon = (p: SvgIconProps) => (
  <SvgIcon {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
  </SvgIcon>
);

export const AccessibilityIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="2.2" {...p}>
    <circle cx="12" cy="4.2" r="2" fill="currentColor" stroke="none" />
    <path d="M4.5 8.5c5 1.4 10 1.4 15 0" />
    <path d="M12 9.8v4.4l-3.2 6.8M12 14.2l3.2 6.8" />
  </StrokeIcon>
);

const PlateIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="1.7" {...p}>
    <circle cx="12" cy="12" r="6" />
    <path d="M9.6 9.8c.8-.7 1.6-1 2.6-1" />
    <path d="M2 4v4.5c0 .9.6 1.5 1.3 1.5s1.3-.6 1.3-1.5V4M3.3 4v16" />
    <path d="M21.3 20V4c-1.6 1.1-2.3 3.6-2.3 6.6 0 1 .8 1.5 2.3 1.5" />
  </StrokeIcon>
);

const SkewerIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="1.7" {...p}>
    <path d="M3 21 20.5 3.5" />
    <circle cx="7.6" cy="16.4" r="2.6" />
    <path d="M12 9.2 14.8 12 12 14.8 9.2 12Z" />
    <circle cx="16.4" cy="7.6" r="2.6" />
    <path d="M19 2.6c1.4-.2 2.3.4 2.4 1.7" />
  </StrokeIcon>
);

const PotIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="1.7" {...p}>
    <path d="M4 12h16v5.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" />
    <path d="M2.3 13.5H4M20 13.5h1.7" />
    <path d="M5.5 12c0-1.5 2.9-2.6 6.5-2.6s6.5 1.1 6.5 2.6M12 9.4V8.2" />
    <path d="M8.5 6.2c-.9-1-.9-2 0-3M12 5.5c-.9-1-.9-2 0-3M15.5 6.2c-.9-1-.9-2 0-3" />
  </StrokeIcon>
);

const PastaIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="1.7" {...p}>
    <path d="M2.5 14.5c.3 2.9 4.4 5 9.5 5s9.2-2.1 9.5-5" />
    <path d="M11.2 13.6c-.9-.2-1.1-1.2-.4-1.8.9-.7 2.4-.3 2.7.9.4 1.5-1 2.8-2.7 2.6-2.1-.3-3.2-2.5-2.2-4.4 1.1-2 4-2.4 5.7-.9 1.4 1.3 1.5 3.3.6 4.7" />
    <path d="M18 2.5v3.2M19.8 2.5v3.2M21.6 2.5v3.2M18 5.7c0 1.2.8 1.9 1.8 1.9s1.8-.7 1.8-1.9M19.8 7.6 16 13" />
  </StrokeIcon>
);

const SaladIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="1.7" {...p}>
    <path d="M2.5 12h19c0 4.6-4.2 8.3-9.5 8.3S2.5 16.6 2.5 12Z" />
    <path d="M6.5 12c-.6-2.6 1-4.8 3.6-5 .6 2.2-.4 3.9-1.8 5" />
    <path d="M13 12c.2-3.2 2.3-5.5 5.6-5.7.3 2.7-1.3 4.9-3.6 5.7" />
    <circle cx="12.3" cy="9.3" r="1.4" />
  </StrokeIcon>
);

const CroissantIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="1.7" {...p}>
    <path d="M2.5 15.5C3.5 10 7 6.5 12 6.5s8.5 3.5 9.5 9c-1.8 1.2-4 .9-5.3-.6-1.2 1.4-2.6 2.1-4.2 2.1s-3-.7-4.2-2.1c-1.3 1.5-3.5 1.8-5.3.6Z" />
    <path d="M9.4 7 10 14.4M14.6 7 14 14.4M6 9.4l1.8 5.3M18 9.4l-1.8 5.3" />
  </StrokeIcon>
);

const CupcakeIcon = (p: SvgIconProps) => (
  <StrokeIcon strokeWidth="1.7" {...p}>
    <path d="M5.5 12.5h13l-1.8 8h-9.4Z" />
    <path d="M9.2 12.5l.5 8M14.8 12.5l-.5 8" />
    <path d="M5.5 12.5c-1.6-.4-2-2.6-.5-3.6.2-2.6 2.7-3.8 4.6-2.8.8-1.9 2.4-2.6 3.4-2.6.2 1.3 1.2 2 2.5 2.2 2.4.1 3.8 2 3.6 3.6 1.3 1 .9 3-.6 3.2" />
    <path d="M13 3.5c.2-1 .9-1.7 2-2" />
    <path d="M9 9.5c1.2.6 2.4.6 3.6 0s2.4-.6 3.6 0" />
  </StrokeIcon>
);

const CATEGORY_ICONS: Record<string, typeof PlateIcon> = {
  starters: PlateIcon,
  finger: SkewerIcon,
  hot: PotIcon,
  pasta: PastaIcon,
  salads: SaladIcon,
  pastry: CroissantIcon,
  desserts: CupcakeIcon,
};

export const CategoryIcon = ({ id, ...p }: SvgIconProps & { id: string }) => {
  const Icon = CATEGORY_ICONS[id] ?? PlateIcon;
  return <Icon {...p} />;
};
