import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: '#eef4ff',
    100: '#d0e1fd',
    200: '#a2c4fc',
    300: '#74a7fa',
    400: '#468af9',
    500: '#002855', // Azul Real UPAO
    600: '#001e40',
    700: '#00142b',
    800: '#000b17',
    900: '#000305',
  },
}

const styles = {
  global: {
    'html, body': {
      bg: 'gray.50',
      color: 'gray.800',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      WebkitFontSmoothing: 'antialiased',
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: 'lg',
      transition: 'all 0.2s ease-in-out',
    },
    defaultProps: {
      colorScheme: 'brand',
    },
    variants: {
      solid: (props) => {
        if (props.colorScheme === 'brand') {
          return {
            bg: 'brand.500',
            color: 'white',
            _hover: {
              bg: 'brand.600',
              transform: 'translateY(-1px)',
              boxShadow: 'md',
            },
            _active: {
              bg: 'brand.700',
              transform: 'translateY(0)',
            },
          }
        }
        return {}
      },
      outline: (props) => {
        if (props.colorScheme === 'brand') {
          return {
            borderColor: 'brand.500',
            color: 'brand.500',
            _hover: {
              bg: 'brand.50',
            },
          }
        }
        return {}
      },
      ghost: {
        _hover: {
          bg: 'brand.50',
          color: 'brand.500',
        },
      },
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderRadius: 'lg',
          bg: '#edf2f7',
          borderColor: 'transparent',
          _hover: {
            borderColor: 'brand.300',
          },
          _focus: {
            bg: 'white',
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px #002855',
          },
        },
      },
    },
  },
}

export const theme = extendTheme({ config, colors, styles, components })
export default theme