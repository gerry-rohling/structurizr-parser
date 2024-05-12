workspace {

    model {
        user = person "User" "A user of my software system." "All User"
        swSystem = softwareSystem "Software System" "My software system." {
            webapp = container "Web Application" {
                user -> this "Uses" "HTTPS" "Mobile and web clients"
                -> db "Reads from and writes to"
            }
            db = container "Database"
        }

        user -> swSystem "Uses" "HTTPS"
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