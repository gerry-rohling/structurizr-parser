workspace {

    model {
        user = person "User"
        system1 = softwareSystem "Software System 1" {
            container1 = container "Container 1" {
                component1 = component "Component 1"
            }
        }
        system2 = softwareSystem "Software System 2" {
            container2 = container "Container 2" {
                component2 = component "Component 2"
            }
        }

        user -> component1 "Uses c1"
        user -> component2 "Uses c2"
        component1 -> component2 "Back Channel"
    }

    views {
        systemLandscape "How-is-this" {
            include *
            autolayout
        }
    }
    
}