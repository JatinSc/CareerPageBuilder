import React from 'react';

export const BannerPattern1 = ({ primaryColor, secondaryColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 560">
    <g mask="url(#mask1)" fill="none">
      <rect width="1440" height="560" x="0" y="0" fill={primaryColor}></rect>
      <path d="M679.161,602.496C722.461,605.382,762.242,577.07,782.532,538.71C801.633,502.598,794.58,459.544,773.18,424.746C752.877,391.73,717.901,371.84,679.161,370.616C637.988,369.315,593.439,382.006,574.252,418.459C555.896,453.332,577.67,492.118,597.187,526.355C616.982,561.08,639.279,599.838,679.161,602.496" fill={secondaryColor} opacity="0.4" className="triangle-float2"></path>
      <path d="M30.04 466.25 a170.96 170.96 0 1 0 341.92 0 a170.96 170.96 0 1 0 -341.92 0z" fill={secondaryColor} opacity="0.4" className="triangle-float2"></path>
      <path d="M1153.123,337.254C1197.784,337.615,1243.832,320.959,1265.105,281.689C1285.628,243.805,1271.029,198.667,1247.885,162.325C1226.714,129.081,1192.536,105.888,1153.123,105.843C1113.635,105.798,1078.93,128.633,1057.987,162.11C1035.516,198.03,1024.007,242.672,1044.231,279.904C1065.218,318.541,1109.155,336.899,1153.123,337.254" fill={secondaryColor} opacity="0.4" className="triangle-float1"></path>
      <path d="M474.91121352458447 69.31143833313104L448.7278515564413-53.871594749568374 351.72818044188506 95.49480030127421z" fill={secondaryColor} opacity="0.4" className="triangle-float3"></path>
      <path d="M1111.4057275662954 406.48016982908575L982.2629790332096 316.0534438010982 891.836253005222 445.196192334184 1020.9790015383078 535.6229183621715z" fill={secondaryColor} opacity="0.4" className="triangle-float1"></path>
      <path d="M1071.3831305847186 318.957816798025L1024.8634881172934 231.46709405108936 937.3727653703578 277.9867365185146 983.892407837783 365.47745926545025z" fill={secondaryColor} opacity="0.4" className="triangle-float1"></path>
    </g>
    <defs>
      <mask id="mask1">
        <rect width="1440" height="560" fill="#ffffff"></rect>
      </mask>
      <style>
        {`
          @keyframes float1 { 0%{transform: translate(0, 0)} 50%{transform: translate(-10px, 0)} 100%{transform: translate(0, 0)} }
          .triangle-float1 { animation: float1 5s infinite; }
          @keyframes float2 { 0%{transform: translate(0, 0)} 50%{transform: translate(-5px, -5px)} 100%{transform: translate(0, 0)} }
          .triangle-float2 { animation: float2 4s infinite; }
          @keyframes float3 { 0%{transform: translate(0, 0)} 50%{transform: translate(0, -10px)} 100%{transform: translate(0, 0)} }
          .triangle-float3 { animation: float3 6s infinite; }
        `}
      </style>
    </defs>
  </svg>
);

export const BannerPattern2 = ({ primaryColor, secondaryColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 560">
    <g mask="url(#mask2)" fill="none">
      <rect width="1440" height="560" x="0" y="0" fill={primaryColor}></rect>
      <path d="M 0,127 C 57.6,114.2 172.8,61 288,63 C 403.2,65 460.8,137.8 576,137 C 691.2,136.2 748.8,63.2 864,59 C 979.2,54.8 1036.8,126.8 1152,116 C 1267.2,105.2 1382.4,27.2 1440,5L1440 560L0 560z" fill={secondaryColor} opacity="0.3"></path>
      <path d="M 0,293 C 48,282.6 144,227 240,241 C 336,255 384,367.8 480,363 C 576,358.2 624,220.6 720,217 C 816,213.4 864,337.8 960,345 C 1056,352.2 1104,249.6 1200,253 C 1296,256.4 1392,340.2 1440,362L1440 560L0 560z" fill={secondaryColor} opacity="0.5"></path>
      <path d="M 0,445 C 96,459.6 288,522.2 480,518 C 672,513.8 768,431 960,424 C 1152,417 1344,471.2 1440,483L1440 560L0 560z" fill={secondaryColor} opacity="0.7"></path>
    </g>
    <defs>
      <mask id="mask2">
        <rect width="1440" height="560" fill="#ffffff"></rect>
      </mask>
    </defs>
  </svg>
);

export const BannerPattern3 = ({ primaryColor, secondaryColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 560">
    <g mask="url(#mask3)" fill="none">
      <rect width="1440" height="560" x="0" y="0" fill={primaryColor}></rect>
      <pattern id="pattern3" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill={secondaryColor} opacity="0.5" />
      </pattern>
      <rect width="1440" height="560" fill="url(#pattern3)" />
    </g>
    <defs>
      <mask id="mask3">
        <rect width="1440" height="560" fill="#ffffff"></rect>
      </mask>
    </defs>
  </svg>
);

export const BannerPattern4 = ({ primaryColor, secondaryColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 560">
    <g mask="url(#mask4)" fill="none">
      <rect width="1440" height="560" x="0" y="0" fill={primaryColor}></rect>
      <path d="M-95.46 393.81L-95.46 393.81" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M-95.46 393.81L-81.61 528.03" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M-95.46 393.81L95.14 398.16" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M-95.46 393.81L-72.01 664.93" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M-95.46 393.81L199.61 356.48" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      {/* Reduced complexity for brevity, keeping main structure */}
      <path d="M403.5 343.72L524.12 401.31" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M524.12 401.31L559.23 542.38" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M559.23 542.38L666 649.67" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M661.96 340.62L800.3 240.78" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M800.3 240.78L957.1 238.73" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M957.1 238.73L1132.77 192.18" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
      <path d="M988.62 42.18L1110.11 102.3" stroke={secondaryColor} strokeWidth="1.5" opacity="0.4"></path>
    </g>
    <defs>
      <mask id="mask4">
        <rect width="1440" height="560" fill="#ffffff"></rect>
      </mask>
    </defs>
  </svg>
);

export const BannerPattern5 = ({ primaryColor, secondaryColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 560">
    <g mask="url(#mask5)" fill="none">
      <rect width="1440" height="560" x="0" y="0" fill={primaryColor}></rect>
      <rect width="300" height="300" x="172.05" y="246.03" fill={secondaryColor} opacity="0.2" transform="rotate(234.45, 322.05, 396.03)"></rect>
      <rect width="208.08" height="208.08" x="351.65" y="356.75" fill="white" opacity="0.1" transform="rotate(268.6, 455.69, 460.79)"></rect>
      <path d="M1291.5 420.81 L1328.23 511.19L1370.6668829140426 405.19811708595745z" fill={secondaryColor} opacity="0.3"></path>
      <circle r="46.666666666666664" cx="1263.69" cy="130.56" fill="white" opacity="0.1"></circle>
      <rect width="332.64" height="332.64" x="111.98" y="327.29" fill={secondaryColor} opacity="0.15" transform="rotate(206.8, 278.3, 493.61)"></rect>
      <rect width="300" height="300" x="176.9" y="-18.66" fill="white" opacity="0.05" transform="rotate(287.93, 326.9, 131.34)"></rect>
      <rect width="103.2" height="103.2" x="1073.2" y="-10.1" fill={secondaryColor} opacity="0.25" transform="rotate(291.42, 1124.8, 41.5)"></rect>
      <rect width="324" height="324" x="806.28" y="311.88" fill="white" opacity="0.1" transform="rotate(297.75, 968.28, 473.88)"></rect>
    </g>
    <defs>
      <mask id="mask5">
        <rect width="1440" height="560" fill="#ffffff"></rect>
      </mask>
    </defs>
  </svg>
);

export const BannerPattern6 = ({ primaryColor, secondaryColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 560">
    <g mask="url(#mask6)" fill="none">
      <rect width="1440" height="560" x="0" y="0" fill={primaryColor}></rect>
      <path d="M234.6 63.29L299.56 100.79L299.56 175.79L234.6 213.29L169.65 175.79L169.65 100.79z" stroke={secondaryColor} strokeWidth="2" opacity="0.2"></path>
      <path d="M169.65 175.79L234.6 213.29L234.6 288.29L169.65 325.79L104.69 288.29L104.69 213.29z" stroke={secondaryColor} strokeWidth="2" opacity="0.2"></path>
      <path d="M494.42 288.29L559.37 325.79L559.37 400.79L494.42 438.29L429.46 400.79L429.46 325.79z" stroke={secondaryColor} strokeWidth="2" opacity="0.2"></path>
      <path d="M689.28 175.79L754.23 213.29L754.23 288.29L689.28 325.79L624.32 288.29L624.32 213.29z" stroke={secondaryColor} strokeWidth="2" opacity="0.2"></path>
      <path d="M1143.95 63.29L1208.91 100.79L1208.91 175.79L1143.95 213.29L1079 175.79L1079 100.79z" stroke={secondaryColor} strokeWidth="2" opacity="0.2"></path>
      <path d="M1338.82 400.79L1403.77 438.29L1403.77 513.29L1338.82 550.79L1273.86 513.29L1273.86 438.29z" stroke={secondaryColor} strokeWidth="2" opacity="0.2"></path>
    </g>
    <defs>
      <mask id="mask6">
        <rect width="1440" height="560" fill="#ffffff"></rect>
      </mask>
    </defs>
  </svg>
);

export const patterns = [
  { id: 'bg1', Component: BannerPattern1, name: 'Triangles' },
  { id: 'bg2', Component: BannerPattern2, name: 'Waves' },
  { id: 'bg3', Component: BannerPattern3, name: 'Dots' },
  { id: 'bg4', Component: BannerPattern4, name: 'Connections' },
  { id: 'bg5', Component: BannerPattern5, name: 'Shapes' },
  { id: 'bg6', Component: BannerPattern6, name: 'Hexagons' },
];
