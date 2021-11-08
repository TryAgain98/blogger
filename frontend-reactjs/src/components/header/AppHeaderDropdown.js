import React, { useState, useEffect, useCallback } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useHistory, Link } from "react-router-dom"

import { getUserById } from 'src/services/userService'
import { getUser, clearUser } from 'src/services/localStorageService'


const AppHeaderDropdown = () => {

  const [user, setUser] = useState({
    id: "",
    avatar: ""
  })

  const history = useHistory()

  const fetchUserById = useCallback(async () => {
    try {
      const id = getUser()?.id
      if (!!id) {
        const res = await getUserById(id)
        if (!!res.data) {
          setUser({
            id: res.data.id,
            avatar: res.data.avatar
          })
        }
      }
    }
    catch (err) {
      alert(err)
    }
  }, [])

  const profile = () => {
    if (!!user) {
      history.push(`/admin/createUser/${user.id}`)
    }
  }

  useEffect(() => {
    fetchUserById()
  }, [])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {!!user ?
          <CAvatar src={"http://localhost:8888/" + user.avatar} size="md" />
          :
          <div className="avatar_logo" />
        }

      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader> */}
        <CDropdownItem onClick={profile} >
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem >
        {/* <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        <CDropdownItem href="/login" onClick={() => {
          clearUser()
        }}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
