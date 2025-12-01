# Database Migration System

Plugin includes a simple database migration handler in `inc/db-migration.php`.

## Usage

Load the migration system in your plugin bootstrap:

```php
require_once __DIR__ . '/inc/db-migration.php';
```

The system auto-runs migrations on `plugins_loaded` when the installed DB version is older than `CURRENT_DB_VERSION`.

## Adding Migrations

1. Increment `CURRENT_DB_VERSION` in `LSWP_DB_Migration`:

   ```php
   const CURRENT_DB_VERSION = '1.1.0';
   ```

2. Register the migration callback in `get_migrations()`:

   ```php
   private static function get_migrations() {
       return array(
           '1.0.0' => array(__CLASS__, 'migrate_to_1_0_0'),
           '1.1.0' => array(__CLASS__, 'migrate_to_1_1_0'),
       );
   }
   ```

3. Implement the migration method:

   ```php
   public static function migrate_to_1_1_0() {
       global $wpdb;
       $table = $wpdb->prefix . '{{slug}}_data';

       $wpdb->query("ALTER TABLE $table ADD COLUMN status varchar(20) DEFAULT 'active'");

       return true;
   }
   ```

## Best Practices

- **Always use `dbDelta()` for `CREATE TABLE`** (it's idempotent and handles schema diffs).
- **Test migrations on staging** with data representative of production.
- **Never drop columns or tables without a deprecation period** (consider renaming or soft-deletes first).
- **Log errors** via `error_log()` for debugging.
- **Version check**: Migrations run only if installed version < target version.

## Rollback (Manual)

For emergencies, admins can rollback:

```php
// In wp-admin or CLI:
LSWP_DB_Migration::rollback('1.0.0');
```

This sets the DB version option to an earlier value, forcing re-run of migrations.

## Checking Current Version

```php
$version = LSWP_DB_Migration::get_db_version();
```

## Example Migration (Schema Change)

```php
public static function migrate_to_1_2_0() {
    global $wpdb;
    $table = $wpdb->prefix . '{{slug}}_data';

    // Add index for performance
    $wpdb->query("CREATE INDEX idx_created ON $table(created_at)");

    return true;
}
```

## Uninstall Cleanup

Database tables should be removed in `uninstall.php`:

```php
global $wpdb;
$table_name = $wpdb->prefix . '{{slug}}_data';
$wpdb->query("DROP TABLE IF EXISTS $table_name");
delete_option('{{slug}}_db_version');
```
