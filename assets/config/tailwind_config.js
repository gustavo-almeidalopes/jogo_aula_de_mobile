tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "bg": "#1D1A36",
                "fg": "#CBA87A",
                "accent": "#E56DB1",
                "ipsum-bg": "#1D1A36",
                "ipsum-fg": "#CBA87A",
                "ipsum-accent": "#E56DB1",
                "retro-black": "#1D1A36",
                "retro-dim": "#1D1A36",
                "retro-white": "#CBA87A",
                "retro-gray": "#CBA87A",
                "retro-yellow": "#CBA87A",
                "retro-green": "#CBA87A",
                "retro-pink": "#E56DB1",
                "retro-red": "#E56DB1",
                "retro-brown": "#E56DB1"
            },
            fontFamily: {
                "arcade": ["'Press Start 2P'", "cursive"],
                "terminal": ["'VT323'", "monospace"]
            },
            boxShadow: {
                "pixel": "4px 4px 0 0 #CBA87A",
                "pixel-lg": "6px 6px 0 0 #CBA87A",
                "pixel-accent": "4px 4px 0 0 #E56DB1",
                "glow-fg": "0 0 20px rgba(203, 168, 122, 0.5)",
                "glow-accent": "0 0 20px rgba(229, 109, 177, 0.6)"
            },
            dropShadow: {
                "pixel": "4px 4px 0 #CBA87A",
                "pixel-accent": "4px 4px 0 #E56DB1"
            },
            animation: {
                "blink": "blink 1s step-end infinite",
            }
        }
    }
}
