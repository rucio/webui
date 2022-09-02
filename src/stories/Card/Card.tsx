import './card.scss'
import {Image} from "../Image/Image";
import {ReactElement} from "react";

interface CardProps {
    img?:boolean
    img_src?:any
    header?:string
    content?:ReactElement
    footer?:Array<any>
}

export const Card = ({
    img=false,
    img_src,
    header='',
    content,
    footer=[],
    ...props
}: CardProps) => {
    return (
        <div className="rucio-card">
            {img ? (
                <div className={"image"}>
                    <figure className="image is-4by3">
                        <Image src={img_src} height={960} width={1280}/>
                    </figure>
                </div>
            ):null}
            { header.length > 0 ?(
                <header className={"header"}>
                    <p className={"header-title"}>{header}</p>
                </header>
            ):null}
            <div className="card-content">
                <div className="content">
                    {content}
                </div>
            </div>
            {footer.length > 0 ?(
                <footer className={"card-footer"}>
                    {footer.map(element=> {
                        return (
                            <a href={element[0]} className="card-footer-item">{element[1]}</a>
                        )})}
                </footer>
            ):null}
        </div>
    )
}
