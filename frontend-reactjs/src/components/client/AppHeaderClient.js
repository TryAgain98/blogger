import React, { useEffect, useState } from "react"
import {
    CAvatar,
    CDropdownItem,
} from '@coreui/react'

import { BiLogOut } from "react-icons/bi";
import { Link, useHistory } from "react-router-dom";
import {
    CCol,
} from '@coreui/react'


import { GrSearch } from "react-icons/gr";
import { ImUser } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";


import { getUser , clearUser} from "src/services/localStorageService";

import { getUserById } from "src/services/userService";

import action from '../../reducer/action'

const AppHeaderClient = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [classSearch, setClassSearch] = useState(false)
    const [user, setUser] = useState(undefined)
    const [search, setSearch] = useState(undefined)
    const [acount, setAcuont] = useState(undefined)

    const userLocall = getUser()

    const category = useSelector(state => state.categorys.items)

    const fetchGetUserById = async () => {
        try {
            if (!!userLocall) {
                const id = userLocall.id
                const res = await getUserById(id)
                if (!!res.data) {
                    setUser(res.data)
                }
            }
        }
        catch (err) {
            alert(err)
        }
    }

    const setLogOut = () => {
        try{
            if(!!userLocall) {
                clearUser()
                history.push('/')
            }

        }
        catch(err) {
            alert(err)
        }
    }

    const onSearchEnter = (e) => {
        if (e.key == 'Enter') {
            setSearch(false)
            dispatch(action.removeCart())
            dispatch(action.addCategory("Tìm Kiếm"))
            history.push(`/home/timkiem/${search}`)

        }
    }


    useEffect(() => {
        fetchGetUserById()
    }, [search])


    return (
        <CCol>
            <div className="style_conten_header">
                <div className="header_cleint d-flex justify-content-between ">
                    <div className="d-flex align-items-center px-5">
                        <Link className="name-list-category" to={`/home`}
                            onClick={() => {
                                dispatch(action.removeCart())
                            }}
                        >
                            <h5 className="headerName_client">BÁO MỚI </h5>
                        </Link>
                    </div>
                    {
                        !!category ?
                            <div
                                className="global-post-category"
                            >{category[0]} </div>
                            :
                            <div></div>
                    }

                    <div className="d-flex align-items-center px-3">
                        <div className={!!classSearch && classSearch == true ? 'style_divSearch_true' : 'style_divSearch_false'}>
                            <div className="Search_icon d-flex align-items-center"
                                onClick={() => {
                                    setClassSearch(!classSearch)
                                }}
                            >
                                <p className="pt-3 mx-1">Tìm kiếm</p>
                                < GrSearch className="style_icon  " />
                            </div>
                        </div>
                        <div style={{ fontSize: 10 }}>
                            {
                                !!user ?
                                    <div className="px-3" style={{ textAlign: "center" }}>
                                        {!!user.avatar ?
                                            <CAvatar src={"http://localhost:8888/" + user.avatar}
                                                onClick={() => {
                                                    setAcuont(!acount)
                                                }}
                                                size="md" />
                                            :
                                            <ImUser className="icon_user" />
                                        }

                                        <div style={{
                                            color: "white",
                                            cursor: "pointer",
                                            marginBottom: 0
                                        }}> {user.display_name}</div>

                                    </div>
                                    :
                                    <div className="px-3" style={{ textAlign: "center" }}>
                                        <ImUser className="icon_user" />
                                        <div >Đăng nhập</div>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="content_input px-3">
                    {
                        !!classSearch && classSearch == true ?
                            <div className="py-3 px-3"> <input
                                placeholder="Tìm kiếm"
                                type="text"
                                onKeyDown={onSearchEnter}
                                onChange={e => setSearch(e.target.value)}
                                className="form-control" /></div>
                            :
                            <div />


                    }
                </div>
                {acount ?
                    <div className="position-acount">
                        <div className="acount">

                            <div>
                                <div className="p-1">Acount</div>
                                <CDropdownItem className="acount-items" >
                                    <ImUser className="pe-1 icon-acount"/>
                                    Profiles
                                </CDropdownItem >
                                <div>
                                    <CDropdownItem 
                                     className="acount-items"
                                     onClick={setLogOut}
                                     >
                                        <BiLogOut className="pe-1 icon-acount"/>
                                        Log out
                                    </CDropdownItem>
                                </div>
                            </div>

                        </div>
                    </div> :
                    <div />
                }
            </div>
        </CCol>
    )
}

export default AppHeaderClient