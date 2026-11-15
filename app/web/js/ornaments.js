/* Small, source-independent SVG assets shared by the library shell. */
(function () {
  'use strict';
  const paths = {
    mandala: '<circle cx="160" cy="160" r="150" opacity=".3"/><circle cx="160" cy="160" r="140" opacity=".5"/><circle cx="160" cy="160" r="116" opacity=".3"/><path d="M160 12V27M160 293V308M12 160H27M293 160H308M55 55L66 66M254 254L265 265M55 265L66 254M254 66L265 55"/><g opacity=".45"><path d="M160 34C185 60 185 84 160 104C135 84 135 60 160 34Z"/><path d="M160 34C185 60 185 84 160 104C135 84 135 60 160 34Z" transform="rotate(45 160 160)"/><path d="M160 34C185 60 185 84 160 104C135 84 135 60 160 34Z" transform="rotate(90 160 160)"/><path d="M160 34C185 60 185 84 160 104C135 84 135 60 160 34Z" transform="rotate(135 160 160)"/><path d="M160 34C185 60 185 84 160 104C135 84 135 60 160 34Z" transform="rotate(180 160 160)"/><path d="M160 34C185 60 185 84 160 104C135 84 135 60 160 34Z" transform="rotate(225 160 160)"/><path d="M160 34C185 60 185 84 160 104C135 84 135 60 160 34Z" transform="rotate(270 160 160)"/><path d="M160 34C185 60 185 84 160 104C135 84 135 60 160 34Z" transform="rotate(315 160 160)"/></g><circle cx="160" cy="160" r="82" stroke-dasharray="1 7"/><path d="M160 196C132 170 136 135 160 110C184 135 188 170 160 196ZM160 196C122 194 103 169 106 139C139 142 158 165 160 196ZM160 196C198 194 217 169 214 139C181 142 162 165 160 196ZM160 196C119 214 91 191 82 166C111 160 142 171 160 196ZM160 196C201 214 229 191 238 166C209 160 178 171 160 196Z" stroke-width="1.8"/><path d="M160 196V142M160 196L123 157M160 196L197 157M121 215H199M139 222H181"/><circle cx="160" cy="22" r="3"/><circle cx="160" cy="298" r="3"/><circle cx="22" cy="160" r="3"/><circle cx="298" cy="160" r="3"/>',
    lotus: '<path d="M120 140C79 106 91 57 120 28C149 57 161 106 120 140ZM120 140C65 141 40 109 45 62C90 70 115 96 120 140ZM120 140C175 141 200 109 195 62C150 70 125 96 120 140ZM120 140C66 167 22 132 14 96C59 90 92 105 120 140ZM120 140C174 167 218 132 226 96C181 90 148 105 120 140Z"/><path d="M120 140V68M120 140L69 88M120 140L171 88" opacity=".5"/><path d="M58 155H182M82 162H158"/>',
    wheel: '<circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="33"/><circle cx="50" cy="50" r="10"/><path d="M50 10V40M50 60V90M10 50H40M60 50H90M22 22L43 43M57 57L78 78M22 78L43 57M57 43L78 22"/><circle cx="50" cy="50" r="2"/>',
    corner: '<path d="M12 88V12H88M22 78V22H78M27 68C27 41 48 42 54 28M31 52C49 56 64 47 67 36C50 35 42 42 31 52ZM28 63C41 51 41 35 31 27C24 38 24 49 28 63Z"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2M4 13H3v7h4v-7H4Zm16 0h1v7h-4v-7h3Z"/>',
    book: '<path d="M12 5C8 2 3 3 3 3v17s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Zm0 0v17"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };
  window.LibraryArt = {
    svg(name, className = '') {
      const box = name === 'mandala' ? '0 0 320 320' : name === 'lotus' ? '0 0 240 180' : ['wheel', 'corner'].includes(name) ? '0 0 100 100' : '0 0 24 24';
      return `<svg class="library-art ${className}" viewBox="${box}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.lotus}</svg>`;
    }
  };
})();
