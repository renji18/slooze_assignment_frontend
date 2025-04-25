import {ChangeEvent, useEffect} from "react";

function ThemeSelector() {
  const themes = ['light', 'cream', 'gray', 'sky', 'green', 'pink'];

  useEffect(() => {
    const savedTheme = localStorage.getItem('slooze_theme') || 'cream';
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value;
    document.body.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('slooze_theme', selectedTheme);
  };

  return (
    <div className="text-sm space-y-2">
      <label htmlFor="theme" className="block font-medium">🎨 Theme</label>
      <select
        id="theme"
        onChange={handleChange}
        defaultValue={typeof window !== 'undefined' ? localStorage.getItem('slooze_theme') || 'cream' : 'cream'}
        className="border border-gray-300 rounded px-2 py-1"
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme[0].toUpperCase() + theme.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSelector;