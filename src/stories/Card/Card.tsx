import './card.scss'

import { ReactElement } from 'react'

import { Image } from '../Image/Image'

export const Card = ({
    img,
    header = <></>,
    content,
    footer = [],
    onCardClick = (args: unknown) => undefined,
    hoverable = false,
}: CardProps) => {
    return (
        <div
            className={hoverable ? 'rucio-card hoverable' : 'rucio-card'}
            onClick={onCardClick}
        >
            {img !== undefined ? (
                <div className={'image'}>
                    <figure className="image is-4by3">
                        <Image src={img} height={960} width={1280} />
                    </figure>
                </div>
            ) : null}
            {header ? <header>{header}</header> : null}
            <div className="card-content">
                <div className="content">{content}</div>
            </div>
            {footer.length > 0 ? (
                <footer className={'card-footer'}>
                    {footer.map(
                        (element: [string, ReactElement], index: number) => {
                            return (
                                <a
                                    key={index}
                                    href={element?.[0]}
                                    className="card-footer-item"
                                >
                                    {element?.[1]}
                                </a>
                            )
                        },
                    )}
                </footer>
            ) : null}
        </div>
    )
}
