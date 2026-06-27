package org.example.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.dtos.response.AssociateResponse;
import org.example.models.Associate;
import org.example.models.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-22T21:10:02-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class AssociateMapperImpl implements AssociateMapper {

    @Override
    public AssociateResponse toResponse(Associate associate) {
        if ( associate == null ) {
            return null;
        }

        Long internId = null;
        String internName = null;
        Long id = null;
        String name = null;
        String cpf = null;
        String address = null;
        String phone = null;
        String caseReport = null;
        String legalGuidance = null;
        String attendanceStatus = null;
        String attendanceType = null;
        Long coordinatorId = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        internId = associateInternId( associate );
        internName = associateInternName( associate );
        id = associate.getId();
        name = associate.getName();
        cpf = associate.getCpf();
        address = associate.getAddress();
        phone = associate.getPhone();
        caseReport = associate.getCaseReport();
        legalGuidance = associate.getLegalGuidance();
        attendanceStatus = associate.getAttendanceStatus();
        attendanceType = associate.getAttendanceType();
        coordinatorId = associate.getCoordinatorId();
        createdAt = associate.getCreatedAt();
        updatedAt = associate.getUpdatedAt();

        AssociateResponse associateResponse = new AssociateResponse( id, name, cpf, address, phone, caseReport, legalGuidance, attendanceStatus, attendanceType, coordinatorId, internId, internName, createdAt, updatedAt );

        return associateResponse;
    }

    @Override
    public List<AssociateResponse> toResponseList(List<Associate> associates) {
        if ( associates == null ) {
            return null;
        }

        List<AssociateResponse> list = new ArrayList<AssociateResponse>( associates.size() );
        for ( Associate associate : associates ) {
            list.add( toResponse( associate ) );
        }

        return list;
    }

    private Long associateInternId(Associate associate) {
        if ( associate == null ) {
            return null;
        }
        User intern = associate.getIntern();
        if ( intern == null ) {
            return null;
        }
        Long id = intern.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String associateInternName(Associate associate) {
        if ( associate == null ) {
            return null;
        }
        User intern = associate.getIntern();
        if ( intern == null ) {
            return null;
        }
        String name = intern.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
