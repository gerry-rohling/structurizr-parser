workspace {

    model {
        user = person "User"
        system = softwareSystem "Software System"

        user -> system "Uses"
    }

    views {
        systemContext system {
            include *
            autolayout lr
        }
    }
    
}
