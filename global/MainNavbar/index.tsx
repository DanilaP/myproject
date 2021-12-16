import Link from "next/link";
import React from "react";
import s from './mainNavbar.module.scss';

export default function MainNavbar(props: {currentPage: string}): JSX.Element {
    return(
        <nav className={s.nav}>
			<ul>  
				<li
					className={
						props.currentPage === '/peoples'
							? `${s.navLink} ${s.activeLink}`
							: `${s.navLink}`
					}>
					<Link href=''>Люди</Link>
				</li>
				<li
					className={
						props.currentPage === '/events'
							? `${s.navLink} ${s.activeLink}`
							: `${s.navLink}`
					}>
					<Link href=''>События</Link>
				</li>
				<li
					className={
						props.currentPage === '/interests'
							? `${s.navLink} ${s.activeLink}`
							: `${s.navLink}`
					}>
					<Link href=''>Интересы</Link>
				</li>
				<li className={s.navlink}>
				  <Link href='/profile' passHref>
				   <img 
				    src="https://upload.wikimedia.org/wikipedia/commons/8/87/Igor_V._Rybakov_TN.jpg" 
					alt="Аватарка" 
					className={`${s.round} ${s.avatar}`}
				   />
				  </Link>
				</li>
				<li className={s.navlink}>
				  <select className={s.select}>
				      <option className={s.option} value="Дима"><Link href='/profile'>Дима</Link></option>
					  <option className={s.option} value="logOut">Выход</option>
				  </select>
				</li>
			</ul>
		</nav>
    )
}