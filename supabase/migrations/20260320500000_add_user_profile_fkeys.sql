ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(user_id);
ALTER TABLE reactions ADD CONSTRAINT reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES user_profiles(user_id);
ALTER TABLE feed_items ADD CONSTRAINT feed_items_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES user_profiles(user_id);
ALTER TABLE notifications ADD CONSTRAINT notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES user_profiles(user_id);
