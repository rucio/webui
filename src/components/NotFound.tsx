import { Card } from "../stories/Card/Card"
import { Image } from "../stories/Image/Image"

function NotFound() {
    return (
        <div className="container-card">
            <div className="wrap-card">
                <Card
                    content={
                        <>
                            <Image
                                src={require('../images/favicon.png')}
                                height={150}
                                width={150}
                            />
                            <div className="notfound">
                                <div className="notfound-404">
                                <h1>Oops!</h1>
                                </div>
                                <h2>404 - Page not found</h2>
                                <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                            </div>
                        </>
                    }
                />
            </div>
        </div>


    )
}

export default NotFound
