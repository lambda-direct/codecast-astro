import type { FC } from 'react';

interface Props {
	blocks: Block[];
}

export interface Block {
	id: string;
	type: string;
	data: any;
}

interface ListItem {
	content: string;
	items: Array<ListItem>;
}

interface Image {
	file: {
		url: string;
	};
	caption: string;
	withBorder: boolean;
	stretched: boolean;
	withBackground: boolean;
}

export const EditorRender: FC<Props> = ({ blocks }) => {
	const listFunc = (items: ListItem[], style: string) => {
		return items.map((item: any) => {
			if (item.items.length === 0) {
				return <li>{item.content}</li>;
			} else {
				return (
					<li>
						{item.content}
						{style === 'ordered' && (
							<ol className={'notion-list notion-list-numbered'}>
								{listFunc(item.items, style)}
							</ol>
						)}
						{style === 'unordered' && (
							<ul className={'notion-list notion-list-disc'}>
								{listFunc(item.items, style)}
							</ul>
						)}
					</li>
				);
			}
		});
	};

	const pickObject = (block: Block) => {
		let result: React.ReactElement | null = null;
		switch (block.type) {
			case 'header':
				const level = 'notion-h' + String(block.data.level);
				if (level) {
					result = (
						<div key={block.id} className={level}>
							{block.data.text}
						</div>
					);
				}
				break;
			case 'paragraph':
				result = (
					<div
						dangerouslySetInnerHTML={{ __html: block.data.text }}
						key={block.id}
						className={'notion-text'}
					/>
				);
				break;
			case 'list':
				if (block.data.style === 'unordered') {
					result = (
						<ul className='notion-list notion-list-disc'>
							{listFunc(block.data.items, 'unordered')}
						</ul>
					);
				} else {
					result = (
						<ol className={'notion-list notion-list-numbered'}>
							{listFunc(block.data.items, 'ordered')}
						</ol>
					);
				}
				break;
			case 'image':
				if (block.data as Image) {
					result = (
						<figure className={'notion-asset-wrapper'}>
							<img
								style={{ position: 'relative' }}
								className={'notion-image-inset'}
								src={block.data.file.url}
							/>
							{block.data.caption && (
								<figcaption className={'notion-image-caption'}>
									{block.data.caption}
								</figcaption>
							)}
						</figure>
					);
				}
				break;
			case 'quote':
				result = (
					<figure className={'notion-quote'}>
						<blockquote>{block.data.text}</blockquote>
						{block.data.caption && (
							<figcaption className={'notion-image-caption'}>
								{block.data.caption}
							</figcaption>
						)}
					</figure>
				);
				break;
		}
		return result;
	};
	return (
		<div className={'notion'}>
			{blocks.map((block: Block) => pickObject(block))}
		</div>
	);
};
