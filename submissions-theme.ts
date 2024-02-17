
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const submissionsTheme: CustomThemeConfig = {
    name: 'submissions-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "0 0 0",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #0D9488 - Tailwind Teal 600
		"--color-primary-50": "219 239 237", // #dbefed
		"--color-primary-100": "207 234 231", // #cfeae7
		"--color-primary-200": "195 228 225", // #c3e4e1
		"--color-primary-300": "158 212 207", // #9ed4cf
		"--color-primary-400": "86 180 172", // #56b4ac
		"--color-primary-500": "13 148 136", // #0D9488
		"--color-primary-600": "12 133 122", // #0c857a
		"--color-primary-700": "10 111 102", // #0a6f66
		"--color-primary-800": "8 89 82", // #085952
		"--color-primary-900": "6 73 67", // #064943
		// secondary | #9333EA - Tailwind Purple 600
		"--color-secondary-50": "239 224 252", // #efe0fc
		"--color-secondary-100": "233 214 251", // #e9d6fb
		"--color-secondary-200": "228 204 250", // #e4ccfa
		"--color-secondary-300": "212 173 247", // #d4adf7
		"--color-secondary-400": "179 112 240", // #b370f0
		"--color-secondary-500": "147 51 234", // #9333EA
		"--color-secondary-600": "132 46 211", // #842ed3
		"--color-secondary-700": "110 38 176", // #6e26b0
		"--color-secondary-800": "88 31 140", // #581f8c
		"--color-secondary-900": "72 25 115", // #481973
		// tertiary | #2563EB - Tailwind Blue 600
		"--color-tertiary-50": "222 232 252", // #dee8fc
		"--color-tertiary-100": "211 224 251", // #d3e0fb
		"--color-tertiary-200": "201 216 250", // #c9d8fa
		"--color-tertiary-300": "168 193 247", // #a8c1f7
		"--color-tertiary-400": "102 146 241", // #6692f1
		"--color-tertiary-500": "37 99 235", // #2563EB
		"--color-tertiary-600": "33 89 212", // #2159d4
		"--color-tertiary-700": "28 74 176", // #1c4ab0
		"--color-tertiary-800": "22 59 141", // #163b8d
		"--color-tertiary-900": "18 49 115", // #123173
		// success | #22C55E - Tailwind Green 500
		"--color-success-50": "222 246 231", // #def6e7
		"--color-success-100": "211 243 223", // #d3f3df
		"--color-success-200": "200 241 215", // #c8f1d7
		"--color-success-300": "167 232 191", // #a7e8bf
		"--color-success-400": "100 214 142", // #64d68e
		"--color-success-500": "34 197 94", // #22C55E
		"--color-success-600": "31 177 85", // #1fb155
		"--color-success-700": "26 148 71", // #1a9447
		"--color-success-800": "20 118 56", // #147638
		"--color-success-900": "17 97 46", // #11612e
		// warning | #EAB308 - Tailwind Yellow 500
		"--color-warning-50": "252 244 218", // #fcf4da
		"--color-warning-100": "251 240 206", // #fbf0ce
		"--color-warning-200": "250 236 193", // #faecc1
		"--color-warning-300": "247 225 156", // #f7e19c
		"--color-warning-400": "240 202 82", // #f0ca52
		"--color-warning-500": "234 179 8", // #EAB308
		"--color-warning-600": "211 161 7", // #d3a107
		"--color-warning-700": "176 134 6", // #b08606
		"--color-warning-800": "140 107 5", // #8c6b05
		"--color-warning-900": "115 88 4", // #735804
		// error | #EF4444 - Tailwind Red 500
		"--color-error-50": "253 227 227", // #fde3e3
		"--color-error-100": "252 218 218", // #fcdada
		"--color-error-200": "251 208 208", // #fbd0d0
		"--color-error-300": "249 180 180", // #f9b4b4
		"--color-error-400": "244 124 124", // #f47c7c
		"--color-error-500": "239 68 68", // #EF4444
		"--color-error-600": "215 61 61", // #d73d3d
		"--color-error-700": "179 51 51", // #b33333
		"--color-error-800": "143 41 41", // #8f2929
		"--color-error-900": "117 33 33", // #752121
		// surface | #57534E - Tailwind Stone 600
		"--color-surface-50": "230 229 228", // #e6e5e4
		"--color-surface-100": "221 221 220", // #dddddc
		"--color-surface-200": "213 212 211", // #d5d4d3
		"--color-surface-300": "188 186 184", // #bcbab8
		"--color-surface-400": "137 135 131", // #898783
		"--color-surface-500": "87 83 78", // #57534E
		"--color-surface-600": "78 75 70", // #4e4b46
		"--color-surface-700": "65 62 59", // #413e3b
		"--color-surface-800": "52 50 47", // #34322f
		"--color-surface-900": "43 41 38", // #2b2926
		
	}
}