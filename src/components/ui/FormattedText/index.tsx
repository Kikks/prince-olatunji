import React from "react";
import { marked } from "marked";

import "./FormattedText.scss";

const renderer = new marked.Renderer();

renderer.table = token => {
	return `
    <div class="w-full overflow-x-auto">
      <table>
        <thead>${token.header}</thead>
        <tbody>
					${token.rows.map(cells => `<tr>${cells.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
				</tbody>
      </table>
    </div>
  `;
};

marked.setOptions({
	renderer,
	breaks: true
});

const FormattedText = ({
	text,
	className
}: {
	text: string;
	className?: string;
}) => {
	const htmlContent = marked(text);

	return (
		<div className={`formatted-text text-sm ${className || ""}`}>
			<div
				dangerouslySetInnerHTML={{ __html: htmlContent }}
				className='space-y-5 leading-loose'
			/>
		</div>
	);
};

export default FormattedText;
