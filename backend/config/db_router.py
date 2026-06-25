class DatabaseRouter:
    """
    Route only Nivada and ScanPg to SQL Server.
    Everything else uses PostgreSQL.
    """

    def db_for_read(self, model, **hints):
        if model.__name__ == "Nivada":
            return "dopdata"

        if model.__name__ == "ScanPg":
            return "dopimages"

        return "default"

    def db_for_write(self, model, **hints):
        # We never write to SQL Server.
        return "default"

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if db in ("dopdata", "dopimages"):
            return False
        return db == "default"