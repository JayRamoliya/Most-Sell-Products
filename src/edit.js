import { __ } from '@wordpress/i18n';



import {
	useBlockProps,
	RichText,
	InspectorControls,
	AlignmentControl,
	BlockControls,
	PanelColorSettings
} from '@wordpress/block-editor';
import './editor.scss';



import {
	useState,
	useEffect
} from '@wordpress/element';



import { useEntityProp, useEntityId } from '@wordpress/core-data';



import {
	Button,
	TextControl,
	SelectControl,
	PanelBody,
	PanelRow,
	ToggleControl,
	ExternalLink
} from '@wordpress/components';



import { useSelect, useDispatch, select } from '@wordpress/data';



// const clicktobtn = () => {
// 	alert('click')
// }
// const MyButton = () => <Button variant="secondary" onClick={clicktobtn}>Click me!</Button>;



import { __experimentalInputControl as InputControl } from '@wordpress/components';



export default function Edit({ attributes, setAttributes }) {
	const { title, content, postMeta, customTaxonomy, align, textColor, backgroundColor, kaLink, linkLabel, hasLinkNofollow, productarr, sellcounter, mostsellproducts, mostsellvalue } = attributes;

	// console.log(content);

	const postType = useSelect(
		(select) => select('core/editor').getCurrentPostType(),
		[]
	);
	// console.log(postType);

	const postId = wp.data.select("core/editor").getCurrentPostId();
	// console.log(postId);


	const meta = useSelect(
		(select) => {
			if (postId) {
				return select('core/editor').getEditedPostAttribute('meta');
			}
			return {};
		},
		[postId]
	);
	// console.log(meta);



	// jQuery('.editor-post-publish-button__button.is-primary').on('click', function () {
	// 	// alert('click')
	// 	// console.log('click');
	// });




	// const { editPost } = useDispatch('core/editor');
	const [sellCount, setSellCount] = useState(meta.sell_count || '');
	// console.log(typeof(sellCount));
	setAttributes({ sellcounter: sellCount })


	// useEffect(() => {
	// 	setSellCount(meta.sell_count || '');
	// }, [meta.sell_count]);

	// const updateMetaValue = (value) => {
	// 	setSellCount(value);
	// 	editPost({ meta: { ...meta, sell_count: value } });
	// };



	const customTaxonomyTerms = useSelect((select) => {
		const { getEntityRecords } = select('core');
		return getEntityRecords('taxonomy', 'product_category', { per_page: -1 });
	}, []);
	// console.log(customTaxonomyTerms);



	const [products, setProducts] = useState([]);

	useEffect(() => {
		if (customTaxonomy) {
			wp.apiFetch({
				path: `/wp/v2/products?product_category=${customTaxonomy}`
				// path: `/cr/v1/mostproducts/{customTaxonomy}`
			}).then((fetchedProducts) => {
				setProducts(fetchedProducts);
				setAttributes({ productarr: fetchedProducts })
			});
		}
	}, [customTaxonomy]);
	// console.log(typeof(customTaxonomy));



	const posts = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'products');
	}, []);



	const setmetavalue = (value) => {
		setAttributes({ sellcounter: value })
		let testsell = jQuery('#sell_count[name="sell_count"]').val(value)
		// console.log(testsell);
		setSellCount(value);
		wp.apiFetch({
			path: `/wp/v2/products/${postId}`,
			method: 'POST',
			data: {
				meta: {
					sell_count: value
				}
			}
		}).then(response => {
			console.log('Product meta updated:', response);
		});
	}
	// console.log(products);
	// console.log(typeof(products));


	const [sellcountproduct, setSellcountproduct] = useState(meta.sell_count || '');
	const [sellproducts, setSellProducts] = useState([]);
	setAttributes({ mostsellvalue: sellcountproduct })
	// console.log(mostsellvalue);


	const setproductmetavalue = (value) => {
		if (sellcountproduct) {
			wp.apiFetch({
				path: `/cr/v1/mostproducts/${value}`
			}).then((fetchedProducts) => {
				setSellProducts(fetchedProducts);
				setAttributes({ mostsellproducts: fetchedProducts })
			});
		}
	}



	const onChangeContent = (newContent) => {
		setAttributes({ content: newContent })
	}
	const onChangeAlign = (newAlign) => {
		setAttributes({
			align: newAlign === undefined ? 'none' : newAlign,
		})
	}
	const onChangeBackgroundColor = (newBackgroundColor) => {
		setAttributes({ backgroundColor: newBackgroundColor })
	}

	const onChangeTextColor = (newTextColor) => {
		setAttributes({ textColor: newTextColor })
	}


	const onChangeKaLink = (newKaLink) => {
		setAttributes({ kaLink: newKaLink === undefined ? '' : newKaLink })
	}

	const onChangeLinkLabel = (newLinkLabel) => {
		setAttributes({ linkLabel: newLinkLabel === undefined ? '' : newLinkLabel })
	}

	const toggleNofollow = () => {
		setAttributes({ hasLinkNofollow: !hasLinkNofollow })
	}




	return (
		<div {...useBlockProps()}>

			<BlockControls>
				<AlignmentControl
					value={attributes.align}
					onChange={onChangeAlign}
				/>
			</BlockControls>


			<InspectorControls>
				<PanelBody title="Product List Settings">
					<PanelRow>
						<ul>
							{sellproducts && sellproducts.length > 0 ? sellproducts.map(product => (
								<li key={product.id}>
									<b>TITLE:</b> {product.name} ({product.sell_count})
								</li>
							)) : <li>No products found</li>}
						</ul>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<InspectorControls>
				{/* <PanelBody title={__('Link Settings', 'my-custom-block')} initialOpen={true}>
					<PanelRow>
						<fieldset>
							<TextControl
								label={__('link', 'my-custom-block')}
								value={kaLink}
								onChange={onChangeKaLink}
								help={__('Add your website link', 'my-custom-block')}
							/>
						</fieldset>
					</PanelRow>
					<PanelRow>
						<fieldset>
							<TextControl
								label={__('Link label', 'my-custom-block')}
								value={linkLabel}
								onChange={onChangeLinkLabel}
								help={__('Add link label', 'my-custom-block')}
							/>
						</fieldset>
					</PanelRow>
					<PanelRow>
						<fieldset>
							<ToggleControl
								label="Add rel = nofollow"
								help={
									hasLinkNofollow
										? 'Has rel nofollow.'
										: 'No rel nofollow.'
								}
								checked={hasLinkNofollow}
								onChange={toggleNofollow}
							/>
						</fieldset>
					</PanelRow>
				</PanelBody> */}

				{/* <PanelColorSettings
					title={__('Color settings', 'my-custom-block')}
					initialOpen={false}
					colorSettings={[
						{
							value: textColor,
							onChange: onChangeTextColor,
							label: __('Text color', 'my-custom-block')
						},
						{
							value: backgroundColor,
							onChange: onChangeBackgroundColor,
							label: __('Background color', 'my-custom-block')
						}
					]}
				/> */}

				{/* <TextControl
					label="Additional CSS Class"
					value={title}
					onChange={(title) => setAttributes({
						title: title,
					})}
				/> */}


				{/* <TextControl
					label="Sell Count"
					value={sellCount}
					// onChange={(value) => updateMetaValue(value)}
					onChange={(value) => setmetavalue(value)}
				/> */}


				<TextControl
					label="Most Sell Products"
					value={sellcountproduct}
					onChange={(value) => {
						setSellcountproduct(value);
						setproductmetavalue(value);
					}}
				/>


				{/* <InputControl
					value={content}
					onChange={(nextValue) => setAttributes({
						content: nextValue,
					})}
				/> */}


				<SelectControl
					label="Custom Taxonomy"
					value={customTaxonomy}
					options={customTaxonomyTerms ? customTaxonomyTerms.map(term => ({
						label: term.name,
						value: term.id
					})) : []}
					onChange={(value) => setAttributes({ customTaxonomy: value })}
				/>

				{/* <MyButton /> */}
			</InspectorControls>


			{/* <p><b>POST ID:</b> {postId}</p>
			<b><b>POST TYPE:</b> {postType}</b>

			<p><b>SELL COUNT VLAUE:</b> {sellCount}</p>
			<p><b>TITLE ATTRIBUTES:</b> {title}</p>

			<p><b>CONTENT ATTRIBUTES:</b> {content}</p>
			<p><b>CUSTOM TAXOMONY:</b> {customTaxonomy}</p> */}

			{/* <ul>
				{products && products.length > 0 ? products.map(product => (
					<div key={product.id}>
						<li><b>TITLE:</b> {product.title.rendered}</li>
						<li><b>SELL COUNT VALUE:</b> {product.meta.sell_count}</li>
						<br />
					</div>
				)) : <li>No products found</li>}
			</ul> */}


			<ul>
				{sellproducts && sellproducts.length > 0 ? sellproducts.map(product => (
					<div key={product.id}>
						<li><b>TITLE:</b> {product.name}</li>
						<li><b>SELL COUNT VALUE:</b> {product.sell_count}</li>
						<br />
					</div>
				)) : <li>No products found</li>}
			</ul>


			{/* <i>LATEST POST:
				{!posts && 'Loading'}
				{posts && posts.length === 0 && 'No Posts'}
				{posts && posts.length > 0 && (
					<a href={posts[0].link}>
						{posts[0].title.rendered}
					</a>
				)}
			</i> */}


			{/* <RichText
				tagName="p"
				onChange={onChangeContent}
				allowedFormats={['core/bold', 'core/italic']}
				value={attributes.content}
				placeholder={__('Write your text...')}
				style={{ textAlign: align, backgroundColor: backgroundColor, color: textColor }}
			/> */}


			{/* <ExternalLink
				href={kaLink}
				className="ka-button"
				rel={hasLinkNofollow ? "nofollow" : ""}>
				{linkLabel}
			</ExternalLink> */}

		</div>
	);
}
