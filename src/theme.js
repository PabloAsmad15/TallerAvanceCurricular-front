import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: '#e6f0ff',
    100: '#b3d1ff',
    200: '#80b3ff',
    300: '#4d94ff',
    400: '#1a75ff',
    500: '#147bff', // Color principal UPAO
    600: '#005ed6',
    700: '#0046b0',
    800: '#002f8a',
    900: '#001964',
  },
  accent: {
    50: '#fff5f0',
    500: '#ff6b35',
    600: '#e8551e',
  }
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
            color: 'brand.600',
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
          color: 'brand.600',
        },
      },
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderRadius: 'lg',
          bg: 'white',
          borderColor: 'gray.200',
          _hover: {
            borderColor: 'brand.300',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px #147bff',
          },
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'sm',
        border: '1px solid',
        borderColor: 'gray.100',
        bg: 'white',
        overflow: 'hidden',
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: 'xl',
      },
    },
  },
}

export const theme = extendTheme({ config, colors, styles, components })
export default theme