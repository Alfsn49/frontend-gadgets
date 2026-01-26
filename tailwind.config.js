/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" // add this line
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {"50":"#f5f3ff","100":"#ede9fe","200":"#ddd6fe","300":"#c4b5fd","400":"#a78bfa","500":"#8b5cf6","600":"#7c3aed","700":"#6d28d9","800":"#5b21b6","900":"#4c1d95","950":"#2e1065"}
      },
      animation:{
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'stagger-fade': 'staggerFade 0.5s ease-out forwards',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
        'card-hover': 'cardHover 0.3s ease-out forwards',
        'card-hover-out': 'cardHoverOut 0.2s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(15px) scale(0.98)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        fadeInDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-15px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        staggerFade: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        cardHover: {
          '0%': { 
            transform: 'scale(1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          },
          '100%': { 
            transform: 'scale(1.02)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
          },
        },
        cardHoverOut: {
          '0%': { 
            transform: 'scale(1.02)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
          },
          '100%': { 
            transform: 'scale(1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          },
        },
      },
      transitionProperty: {
        'all-smooth': 'all 0.3s ease-out',
        'transform-opacity': 'transform, opacity',
        'height-width': 'height, width',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '450': '450ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }
    },
    fontFamily: {
      'body': [
    'Open Sans', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Roboto', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    'Apple Color Emoji', 
    'Segoe UI Emoji', 
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ],
      'sans': [
    'Open Sans', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Roboto', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    'Apple Color Emoji', 
    'Segoe UI Emoji', 
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ]
    }
  },
  plugins: [
    require('flowbite/plugin'),// add this line
     
    
  ],
}

