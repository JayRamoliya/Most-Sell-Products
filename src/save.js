// import { useBlockProps } from '@wordpress/block-editor';

// export default function save() {
// 	return (
// 		<div {...useBlockProps.save()}>
// 			<button>save</button>
// 		</div>
// 	);
// }



// import { RichText, useBlockProps } from '@wordpress/block-editor';

// export default function save( { attributes } ) {
// 	const { title, content, postMeta, customTaxonomy } = attributes;

// 	return (
// 		<pre { ...useBlockProps.save() }>
// 			<RichText.Content value={ content } />
// 			{title}
// 			{postMeta}
// 			{customTaxonomy}
// 		</pre>
// 	);
// }


import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { title, content, postMeta, customTaxonomy, backgroundColor, textColor, align, kaLink, linkLabel, hasLinkNofollow, productarr, sellcounter, mostsellvalue } = attributes;
	// console.log(attributes);
	const blockProps = useBlockProps.save();


	// console.log(productarr);
	// console.log(sellcounter);
	return (
		<div {...blockProps}>

			{/* <p>{sellcounter}</p> */}
			<p>{mostsellvalue}</p>


			{/* <RichText.Content
				tagName="p"
				value={attributes.content}
				style={{ textAlign: align, backgroundColor: backgroundColor, color: textColor }}
			/> */}

			{/* <p>
				<a
					href={kaLink}
					className="ka-button"
					rel={hasLinkNofollow ? "nofollow" : "noopener noreferrer"}>
					{linkLabel}
				</a>
			</p>

			{
				productarr.map((value, index) => {
					return (
						<div key={index}>
							<p>{value.id}</p>
							<p>{value.title.rendered}</p>
						</div>
					)
				})
			} */}
		</div>
	);
}