package org.example.mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.example.dtos.response.ConsultationResponse;
import org.example.models.Associate;
import org.example.models.Consultation;
import org.example.models.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-22T21:10:02-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ConsultationMapperImpl implements ConsultationMapper {

    @Override
    public ConsultationResponse toResponse(Consultation consultation) {
        if ( consultation == null ) {
            return null;
        }

        Long internId = null;
        String internName = null;
        Long associateId = null;
        String associateName = null;
        Long id = null;
        String summary = null;
        LocalDate date = null;

        internId = consultationInternId( consultation );
        internName = consultationInternName( consultation );
        associateId = consultationAssociateId( consultation );
        associateName = consultationAssociateName( consultation );
        id = consultation.getId();
        summary = consultation.getSummary();
        date = consultation.getDate();

        LocalDateTime createdAt = null;

        ConsultationResponse consultationResponse = new ConsultationResponse( id, summary, date, internId, internName, associateId, associateName, createdAt );

        return consultationResponse;
    }

    private Long consultationInternId(Consultation consultation) {
        if ( consultation == null ) {
            return null;
        }
        User intern = consultation.getIntern();
        if ( intern == null ) {
            return null;
        }
        Long id = intern.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String consultationInternName(Consultation consultation) {
        if ( consultation == null ) {
            return null;
        }
        User intern = consultation.getIntern();
        if ( intern == null ) {
            return null;
        }
        String name = intern.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long consultationAssociateId(Consultation consultation) {
        if ( consultation == null ) {
            return null;
        }
        Associate associate = consultation.getAssociate();
        if ( associate == null ) {
            return null;
        }
        Long id = associate.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String consultationAssociateName(Consultation consultation) {
        if ( consultation == null ) {
            return null;
        }
        Associate associate = consultation.getAssociate();
        if ( associate == null ) {
            return null;
        }
        String name = associate.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
