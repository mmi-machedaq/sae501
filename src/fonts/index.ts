import localFont from 'next/font/local';

export const Bambino = localFont({
  src: [
    {
      path: './bambino/Bambino-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './bambino/Bambino-ThinItalic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: './bambino/Bambino-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './bambino/Bambino-ExtraLightItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: './bambino/Bambino-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './bambino/Bambino-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: './bambino/Bambino-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './bambino/Bambino-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './bambino/Bambino-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './bambino/Bambino-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: './bambino/Bambino-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './bambino/Bambino-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-family-bambino',
});
