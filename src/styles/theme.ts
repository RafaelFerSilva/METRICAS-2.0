import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
    colors: {
        gray: {
          "900": "#181B23",
          "800": "#1F2029",
          "700": "#353646",
          "600": "#4B4D63",
          "500": "#616480",
          "400": "#797D9A",
          "300": "#9699B0",
          "200": "#B3B5C6",
          "100": "#D1D2DC",
          "50": "#EEEEF2",
        },

        light: {
          "AliceBlue":	"#F0F8FF",
          "GhostWhite":	"#F8F8FF",
          "Snow":	"#FFFAFA",
          "Seashell":	"#FFF5EE",
          "FloralWhite":	"#FFFAF0",
          "WhiteSmoke":	"#F5F5F5",
          "Beige":	"#F5F5DC",
          "OldLace":	"#FDF5E6",
          "Ivory":	"#FFFFF0",
          "Linen":	"#FAF0E6",
          "Cornsilk":	"#FFF8DC",
          "AntiqueWhite":	"#FAEBD7",
          "BlanchedAlmond":	"#FFEBCD",
          "Bisque":	"#FFE4C4",
          "LightYellow":	"#FFFFE0",
          "LemonChiffon":	"#FFFACD",
          "LightGoldenrodYellow":	"#FAFAD2",
          "PapayaWhip":	"#FFEFD5",
          "PeachPuff":	"#FFDAB9",
          "Moccasin":	"#FFE4B5",
          "PaleGoldenrod":	"#EEE8AA",
          "MistyRose":	"#FFE4E1",
          "LavenderBlush":	"#FFF0F5",
          "Lavender":	"#E6E6FA",
          "Thistle":	"#D8BFD8",
          "Azure":	"#F0FFFF",
          "LightCyan":	"#E0FFFF",
          "PowderBlue":	"#B0E0E6",
          "PaleTurquoise":	"#E0FFFF",
          "Honeydew":	"#F0FFF0",
          "MintCream":	"#F5FFFA",
        }
      },
      fonts: {
        heading: 'Roboto',
        body: 'Roboto'
      },
    styles: {
        global: {
            body: {
                bg: 'WhiteSmoke',
                color: 'black'
            }
        }
    }
})