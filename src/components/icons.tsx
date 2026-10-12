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
