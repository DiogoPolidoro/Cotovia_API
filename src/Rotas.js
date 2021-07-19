import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import App from './App'

import Formulario from './Formulario'


const Routes = () => {

    return(

        <Router>
            <Switch>
                <Route exact path="/" component={App}></Route>
                <Route path="/Formulario" component={Formulario}></Route>
            </Switch>
        </Router>
    )
}

export default Routes;