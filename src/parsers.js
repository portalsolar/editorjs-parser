import { sanitizeHtml } from "./utitlities";

export default {
    paragraph: function(data, config) {
        return `<p class="${config.paragraph.pClass}"> ${data.text} </p>`;
    },

    header: function(data) {
        return `<h${data.level}>${data.text}</h${data.level}>`;
    },

    list: function(data) {
        const type = data.style === "ordered" ? "ol" : "ul";
        const items = data.items.reduce(
            (acc, item) => acc + `<li>${item}</li>`,
            ""
        );
        return `<${type}>${items}</${type}>`;
    },

    quote: function(data, config) {
        let alignment = "";
        if (config.quote.applyAlignment) {
            alignment = `style="text-align: ${data.alignment};"`;
        }
        return `<blockquote ${alignment}><p>${data.text}</p><cite>${data.caption}</cite></blockquote>`;
    },

    table: function(data) {
            const rows = data.content.map((row) => {
                        return `<tr>${row.reduce(
        (acc, cell) => acc + `<td>${cell}</td>`,
        ""
      )}</tr>`;
    });
    return `<table><tbody>${rows.join("")}</tbody></table>`;
  },

  image: function (data, config) {
    const imageConditions = `${data.stretched ? "img-fullwidth" : ""} ${
      data.withBorder ? "img-border" : ""
    } ${data.withBackground ? "img-bg" : ""}`;
    const imgClass = config.image.imgClass || "";
    let imageSrc;
    if (config.image.path === "absolute") {
      imageSrc = data.file.url;
    } else {
      imageSrc = config.image.path.replace(
        /<(.+)>/,
        (match, p1) => data.file[p1]
      );
    }

    const alt = data.alt || data.caption;

    if (config.image.use === "img") {
      return `<img class="${imageConditions} ${imgClass}" src="${imageSrc}" alt="${alt}">`;
    } else if (config.image.use === "figure") {
      const figureClass = config.image.figureClass || "";
      const figCapClass = config.image.figCapClass || "";

      return `<figure class="${figureClass}"><img class="${imgClass} ${imageConditions}" src="${imageSrc}" alt="${alt}"><figcaption class="${figCapClass}">${data.caption}</figcaption></figure>`;
    }
  },
  code: function (data, config) {
    const markup = sanitizeHtml(data.code);
    return `<pre><code class="${config.code.codeBlockClass}">${markup}</code></pre>`;
  },
  raw: function (data) {
    return data.html;
  },
  delimiter: function (data) {
    return "<br />";
  },
  simulator: function (data) {
    return "<simulator> </simulator>";
  },
  ctaButton: function (data) {
    return "<ctaButton> </ctaButton>";
  },
  customButton: function customButton(data) {
    return `<customButton align="${data.align || 'center'}" link="${data.link || '#'}" title="${data.title || 'Botão'} target="${data.target || '_blank'}"> </customButton>`;
  },
  embed: function (data, config) {
    if (config.embed.useProvidedLength) {
      data.length = `width="${data.width}" height="${data.height}"`;
    } else {
      data.length = "";
    }
    const regex = new RegExp(/<%data\.(.+?)%>/, "gm");
    if (config.embedMarkups[data.service]) {
      return config.embedMarkups[data.service].replace(
        regex,
        (match, p1) => data[p1]
      );
    } else {
      return config.embedMarkups["defaultMarkup"].replace(
        regex,
        (match, p1) => data[p1]
      );
    }
  },
};