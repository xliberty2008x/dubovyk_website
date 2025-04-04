# Updating Supabase Storage Policies for Profile Images

To ensure that profile images are accessible to all users (including non-authenticated users), you need to update the RLS (Row-Level Security) policies for your storage bucket. Follow these steps:

## 1. Log in to Supabase Dashboard

1. Go to [https://app.supabase.io/](https://app.supabase.io/)
2. Select your project

## 2. Navigate to Storage Settings

1. In the left sidebar, click on "Storage"
2. Select the bucket `dubovyk-assets`

## 3. Update Policies

You need to create or update policies for both the bucket itself and the objects within it.

### For Public Access to Profile Images

Create the following policies:

#### 1. SELECT Policy (for reading/viewing images)

1. Click on the "Policies" tab
2. Click "Add Policy" (or edit an existing policy)
3. Select "SELECT" operation
4. Name the policy: "Allow public access to profile images"
5. For the policy definition, use:

```sql
bucket_id = 'dubovyk-assets' AND (
  -- Allow public access to profile images
  (storage.foldername(name) = 'private' AND name LIKE 'private/profile_image_%')
)
```

#### 2. INSERT Policy (for uploading images)

1. Click "Add Policy" again
2. Select "INSERT" operation
3. Name the policy: "Allow authenticated users to upload profile images"
4. For the policy definition, use:

```sql
bucket_id = 'dubovyk-assets' AND auth.role() = 'authenticated' AND (
  -- Allow users to upload their own profile images
  (storage.foldername(name) = 'private' AND name LIKE 'private/profile_image_%')
)
```

#### 3. UPDATE Policy (for updating images)

1. Click "Add Policy" again
2. Select "UPDATE" operation
3. Name the policy: "Allow authenticated users to update profile images"
4. For the policy definition, use:

```sql
bucket_id = 'dubovyk-assets' AND auth.role() = 'authenticated' AND (
  -- Allow users to update their own profile images
  (storage.foldername(name) = 'private' AND name LIKE 'private/profile_image_%')
)
```

#### 4. DELETE Policy (for deleting images)

1. Click "Add Policy" again
2. Select "DELETE" operation
3. Name the policy: "Allow authenticated users to delete profile images"
4. For the policy definition, use:

```sql
bucket_id = 'dubovyk-assets' AND auth.role() = 'authenticated' AND (
  -- Allow users to delete their own profile images
  (storage.foldername(name) = 'private' AND name LIKE 'private/profile_image_%')
)
```

## 4. Test the Policies

After setting up these policies:

1. Log out of your application
2. Visit the homepage or any public page
3. Verify that the profile image is visible to non-authenticated users

## Notes

- The policies above allow any authenticated user to upload/update/delete any profile image. In a production environment, you might want to restrict this to only allow users to manage their own profile images.
- The SELECT policy allows public access to all profile images, which is necessary for displaying the profile image on public pages.
- If you have other types of files that should remain private, you'll need to adjust these policies accordingly.
