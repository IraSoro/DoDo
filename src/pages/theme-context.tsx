import React from 'react';

export let ThemeContext = React.createContext({
    theme: "orange",
    toggleTheme: (newTheme: string) => { },
});
