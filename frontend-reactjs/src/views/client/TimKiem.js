import { useCallback, useEffect, useState } from "react";
import { useParams , useHistory} from "react-router-dom"
import { getPost } from "src/services/postService";

import Page from "../components/paginations/Pagination";

import { useDispatch } from "react-redux";
import action from "src/reducer/action"


import ComponentIsHot from "src/components/client/componentClients/ComponentIsHot";

const Timkiem = () => {
    const [posts, setPosts] = useState([])
    const [totalPage, setTotalPage] = useState(undefined)
    const [currentpage, setCurrentPage] = useState(1)

    const { search } = useParams()
    const history = useHistory()

    const dispatch = useDispatch()

    const fetchGetPost = useCallback(async () => {
        try {
            let res = await getPost(search, currentpage)
            if (!!res.data) {
                setTotalPage(res.data.totalPages)
                setPosts([...res.data.items])
            }

        }
        catch (err) {
            alert(err)
        }
    }, [search, currentpage])

    useEffect(() => {
        fetchGetPost()

    }, [search])

    return (
        <div className="style_content py-2" >
            <div className="content-post" >
                <div className="d-flex justify-content-center " style={{
                    width: '100vw',
                }}>
                    <div className="content-post-center-input py-3" style={{ backgroundColor: "white" }}>
                        <div className="show-input p-3">
                            {!!search ?
                                <input
                                    type="text"
                                    value={search}
                                    className="form-control"

                                />
                                :
                                <div />
                            }</div>
                        {!!posts && posts.map((p, index) =>
                            <div key={index} className="component-find-search"
                            onClick={()=>{
                                dispatch(action.removeCart())
                                dispatch(action.addCategory(p.post_category.name))
                                history.push(`/home/post/${p.id}`)
                            }}
                            >
                                < ComponentIsHot
                                style={{boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'}}
                                    image={p.avatar}
                                    name={p.name}
                                    time={p.created_at}
                                />

                            </div>
                        )}
                        <div className="px-3 py-5">
                            <Page
                                totalPage={totalPage}
                                setCurrentPage={setCurrentPage}
                                currentpage={currentpage}
                            />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Timkiem;