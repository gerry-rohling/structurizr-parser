workspace {

    model {
        user = person "User" "A user of my software system."
        swSystem = softwareSystem "Software System" "My software system."

        user -> swSystem "Uses"
    }

    views {
        systemContext swSystem "SystemContext" {
            include *
            autoLayout
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
        }
    }
    
}