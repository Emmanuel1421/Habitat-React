package org.example.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.dtos.response.UserResponse;
import org.example.enums.UserRole;
import org.example.models.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-22T21:10:02-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toResponse(User user) {
        if ( user == null ) {
            return null;
        }

        String coordinatorName = null;
        Long id = null;
        String name = null;
        String email = null;
        UserRole role = null;
        Boolean status = null;
        LocalDateTime createdAt = null;

        coordinatorName = safeCoordinatorName( user.getCoordinator() );
        id = user.getId();
        name = user.getName();
        email = user.getEmail();
        role = user.getRole();
        status = user.getStatus();
        createdAt = user.getCreatedAt();

        UserResponse userResponse = new UserResponse( id, name, email, role, coordinatorName, status, createdAt );

        return userResponse;
    }

    @Override
    public List<UserResponse> toResponseList(List<User> users) {
        if ( users == null ) {
            return null;
        }

        List<UserResponse> list = new ArrayList<UserResponse>( users.size() );
        for ( User user : users ) {
            list.add( toResponse( user ) );
        }

        return list;
    }
}
